export type Favorite = {
    _id: string,
    user_id: string,
    property_id: string,
    createAt: string,
    updateAt: string,
    __v: number,
}

export type checkFavoriteType = {
    isFavorite: boolean,
    favorite: Favorite
}