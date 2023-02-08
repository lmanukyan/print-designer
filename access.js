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

  if( AdminAccess(context) || method === 'create' ){
    return true;
  }

  try{
    const result = await context.req.payload.findByID({
      collection: context.req.collection.config.slug,
      id: context.id,
      showHiddenFields: true,
    });

    return result.author.id == context.req.user.id;
  } catch(e){
    return false;
  }

}