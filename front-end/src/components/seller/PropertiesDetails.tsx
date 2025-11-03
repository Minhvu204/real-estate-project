import type { Property } from '../../types/Property';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const PropertiesDetails = () => {
  const id = useParams();
  const [properties, setProperties] = useState<Property>()
  return (
    <div>PropertiesDetails</div>
  )
}

export default PropertiesDetails