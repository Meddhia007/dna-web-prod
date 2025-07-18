import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createEquipment, updateEquipment, deleteEquipment } from '../../../src/graphql/mutations';
import { listEquipments } from '../../../src/graphql/queries';

const client = generateClient();

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [newEquipment, setNewEquipment] = useState({ name: '', description: '', badge: '', image: '' });

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      const equipmentData = await client.graphql({ query: listEquipments });
      setEquipments(equipmentData.data.listEquipments.items);
    } catch (err) {
      console.error('error fetching equipment', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({ ...newEquipment, [name]: value });
  };

  const handleAddEquipment = async () => {
    try {
      await client.graphql({
        query: createEquipment,
        variables: { input: newEquipment },
      });
      fetchEquipments();
      setNewEquipment({ name: '', description: '', badge: '', image: '' });
    } catch (err) {
      console.error('error creating equipment', err);
    }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      await client.graphql({
        query: deleteEquipment,
        variables: { input: { id } },
      });
      fetchEquipments();
    } catch (err) {
      console.error('error deleting equipment', err);
    }
  };

  return (
    <div>
      <h2>Equipment</h2>
      <div>
        <input name="name" placeholder="Name" value={newEquipment.name} onChange={handleInputChange} />
        <input name="description" placeholder="Description" value={newEquipment.description} onChange={handleInputChange} />
        <input name="badge" placeholder="Badge" value={newEquipment.badge} onChange={handleInputChange} />
        <input name="image" placeholder="Image URL" value={newEquipment.image} onChange={handleInputChange} />
        <button onClick={handleAddEquipment}>Add Equipment</button>
      </div>
      <ul>
        {equipments.map((equipment) => (
          <li key={equipment.id}>
            {equipment.name}
            <button onClick={() => handleDeleteEquipment(equipment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Equipment;
