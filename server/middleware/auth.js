import { clerkClient } from "@clerk/express";

//Middleware to check userid and has a premium subscription
export const auth = async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();
        const hasPremiunPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiunPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { 
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }
        req.plan = hasPremiunPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        res.status(401).json({ 
            message: error.message || 'Unauthorized',
            success: false 
        });
        
    }
}