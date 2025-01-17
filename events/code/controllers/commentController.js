import { JSONFilePreset } from "lowdb/node";
import { getDB } from "./eventController.js";

const db = getDB();
const events = db.data.events;

export function stfuRemoveThisFunction() {
    console.log('wtf am I doing here?');
}

export async function createComment(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (event === undefined) {
        return res.status(404).send('Event not found');
    } else if (!req.body.username || !req.body.content) {
        return res.status(400).send('Missing required fields');
    }

    event.comments.push({
        id: event.nextCommentId,
        username: req.body.username,
        content: req.body.content,
        replies: [],
        nextReplyId: 1
    });
    event.nextCommentId += 1;
    await db.write();

    return res.status(201).send(`Comment created by user: ${req.body.username}`);
}

export async function getComments(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (event === undefined) {
        return res.status(404).send('Event not found');
    }

    return res.status(200).send(event.comments);
}

export async function editComment(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (event === undefined) {
        return res.status(404).send('Event not found');
    }

    const comment = event.comments.find(comment => comment.id == req.params.commentId);
    if (comment === undefined) {
        return res.status(404).send('Comment not found');
    } else if (!req.body.content || !req.body.username) {
        return res.status(400).send('Missing required fields for editing the comment');
    }

    comment.content = req.body.content;
    await db.write();

    return res.status(200).send(`Comment edited by user: ${req.body.username}`);
}

export async function deleteComment(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (event === undefined) {
        return res.status(404).send('Event not found');
    }

    const commentIndex = event.comments.findIndex(comment => comment.id == req.params.commentId);
    if (commentIndex === -1) {
        return res.status(404).send('Comment not found');
    }

    event.comments.splice(commentIndex, 1);
    await db.write();

    return res.status(200).send('Comment deleted');
}
