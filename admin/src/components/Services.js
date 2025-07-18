import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createService, updateService, deleteService } from '../../../src/graphql/mutations';
import { listServices } from '../../../src/graphql/queries';

const client = generateClient();

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const serviceData = await client.graphql({ query: listServices });
      setServices(serviceData.data.listServices.items);
    } catch (err) {
      console.error('error fetching services', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleAddService = async () => {
    try {
      await client.graphql({
        query: createService,
        variables: { input: newService },
      });
      fetchServices();
      setNewService({ title: '', description: '' });
    } catch (err) {
      console.error('error creating service', err);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await client.graphql({
        query: deleteService,
        variables: { input: { id } },
      });
      fetchServices();
    } catch (err) {
      console.error('error deleting service', err);
    }
  };

  return (
    <div>
      <h2>Services</h2>
      <div>
        <input name="title" placeholder="Title" value={newService.title} onChange={handleInputChange} />
        <input name="description" placeholder="Description" value={newService.description} onChange={handleInputChange} />
        <button onClick={handleAddService}>Add Service</button>
      </div>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.title}
            <button onClick={() => handleDeleteService(service.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
