import React from 'react'
import type { Property } from '@/types/Property'
export interface  CreateRequestPropertiesProps  {
     property: Property;
    onClose: () => void;
}


const CreateRequestProperties = (props: CreateRequestPropertiesProps) => {
    const sendRequestToJoinProperty = () => {
    }

    return (
        <div>CreateRequestProperties</div>
    )
}

export default CreateRequestProperties