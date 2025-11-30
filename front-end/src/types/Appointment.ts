export type Appointment = {
    _id: string,
    property_id: {
        _id: string,
        title: {
            vi: string,
            en: string
        },
        price: number
        address: {
            vi: string,
            en: string
        },
        images: [

        ],
        status: string
    },
    buyer_id: string,
    agent_id: {
        _id: string,
        fullName: string,
        email: string
    },
    seller_id: {
        _id: string,
        fullName: string,
        email: string,
        phone: string,
        avatar: string
    },
    time: string,
    note: string,
    location: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    __v: number

}