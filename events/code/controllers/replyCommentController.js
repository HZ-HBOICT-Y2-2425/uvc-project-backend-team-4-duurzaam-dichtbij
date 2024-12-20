import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { 
  meta: { "title": "List of events", "date": "December 2024" }, 
  events: [], 
  nextId: 1,
};
let db = await JSONFilePreset('db.json', defaultData);
let events = db.data.events;
let nextReplyId = 1;

export async function createReply(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (!event) {
        return res.status(404).send('Event not found');
    }

    const comment = event.comments.find(comment => comment.id == req.params.commentId);
    if (!comment) {
        return res.status(404).send('Comment not found');
    }

    if (!req.body.username || !req.body.content) {
        return res.status(400).send('Missing required fields');
    }

    comment.replies.push({
        id: nextReplyId,
        username: req.body.username,
        content: req.body.content,
    });
    nextReplyId += 1;
    await db.write();

    return res.status(201).send(`Reply on comment ${comment.id} created by user: ${req.body.username}`);
}


export async function getReplies(req, res) {
    const comment = events.find(event => event.id == req.params.id).comments.find(comment => comment.id == req.params.commentId);
    if (comment === undefined) {
        return res.status(404).send('Comment not found');
    }

    return res.status(200).send(comment.replies);
}

export async function editReply(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (event === undefined) {
        return res.status(404).send('Event not found');
    }

    const comment = event.comments.find(comment => comment.id == req.params.commentId);
    if (comment === undefined) {
        return res.status(404).send('Comment not found');
    }

    const reply = comment.replies.find(reply => reply.id == req.params.replyId);
    if (reply === undefined) {
        return res.status(404).send('Reply not found');
    } else if (!req.body.content || !req.body.username) {
        return res.status(400).send('Missing required fields for editing the reply');
    }

    reply.content = req.body.content;
    await db.write();

    return res.status(200).send(`Reply edited by user: ${req.body.username}`);
}

export async function deleteReply(req, res) {
    const event = events.find(event => event.id == req.params.id);
    if (event === undefined) {
        return res.status(404).send('Event not found');
    }

    const comment = event.comments.find(comment => comment.id == req.params.commentId);
    if (comment === undefined) {
        return res.status(404).send('Comment not found');
    }

    const replyIndex = comment.replies.findIndex(reply => reply.id == req.params.replyId);
    if (replyIndex === -1) {
        return res.status(404).send('Reply not found');
    }

    comment.replies.splice(replyIndex, 1);
    await db.write();

    return res.status(200).send('Reply deleted');
}
