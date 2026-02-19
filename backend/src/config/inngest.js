import { Inngest } from 'inngest';
import { connectToDB } from './db.js';
import { deleteStreamUser } from './stream.js';


export const inngest = new Inngest({ id: "codehuddle" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "user/created-logged-in" },
    async ({ event }) => {
        await connectToDB();

        const { id, name } = event.data;

        await upsertStreamUser({
            id: id.toString(),
            name: name
        });
    }
);

const deleteUser = inngest.createFunction(
    { id: "delete-stream-user" },
    { event: "user/logged-out" },
    async ({ event }) => {
        await connectToDB();

        const { userId } = event.data;

        await deleteStreamUser(userId.toString());
    }
);

export const functions = [syncUser, deleteUser];