import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../../../src/graphql/mutations';
import { listPortfolioItems } from '../../../src/graphql/queries';

const client = generateClient();

const PortfolioItems = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', category: '', image: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemData = await client.graphql({ query: listPortfolioItems });
      setItems(itemData.data.listPortfolioItems.items);
    } catch (err) {
      console.error('error fetching portfolio items', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async () => {
    try {
      await client.graphql({
        query: createPortfolioItem,
        variables: { input: newItem },
      });
      fetchItems();
      setNewItem({ title: '', category: '', image: '' });
    } catch (err) {
      console.error('error creating portfolio item', err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await client.graphql({
        query: deletePortfolioItem,
        variables: { input: { id } },
      });
      fetchItems();
    } catch (err) {
      console.error('error deleting portfolio item', err);
    }
  };

  return (
    <div>
      <h2>Portfolio Items</h2>
      <div>
        <input name="title" placeholder="Title" value={newItem.title} onChange={handleInputChange} />
        <input name="category" placeholder="Category" value={newItem.category} onChange={handleInputChange} />
        <input name="image" placeholder="Image URL" value={newItem.image} onChange={handleInputChange} />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title} ({item.category})
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioItems;
