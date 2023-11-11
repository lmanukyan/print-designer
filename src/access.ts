export const AuthorizedAccess = (context) => {
    return Boolean(context.req.user);
}

export const AdminAccess = (context) => {
    if( ! AuthorizedAccess(context) ){
        return false;
    }
    return context.req.user.role === 'admin';
}

export const OwnerAccess = async (context) => {

    if( ! AuthorizedAccess(context) ){
        return false;
    }

    const method = context.req.method.toLowerCase();

    if(method === 'create'){
        return true;
    }

    return {
        author: {
            equals: context.req.user.id,
        },
    };
}
