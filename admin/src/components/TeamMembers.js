import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '../../../src/graphql/mutations';
import { listTeamMembers } from '../../../src/graphql/queries';

const client = generateClient();

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', description: '', image: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const memberData = await client.graphql({ query: listTeamMembers });
      setMembers(memberData.data.listTeamMembers.items);
    } catch (err) {
      console.error('error fetching members', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = async () => {
    try {
      await client.graphql({
        query: createTeamMember,
        variables: { input: newMember },
      });
      fetchMembers();
      setNewMember({ name: '', role: '', description: '', image: '' });
    } catch (err) {
      console.error('error creating member', err);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await client.graphql({
        query: deleteTeamMember,
        variables: { input: { id } },
      });
      fetchMembers();
    } catch (err) {
      console.error('error deleting member', err);
    }
  };

  return (
    <div>
      <h2>Team Members</h2>
      <div>
        <input name="name" placeholder="Name" value={newMember.name} onChange={handleInputChange} />
        <input name="role" placeholder="Role" value={newMember.role} onChange={handleInputChange} />
        <input name="description" placeholder="Description" value={newMember.description} onChange={handleInputChange} />
        <input name="image" placeholder="Image URL" value={newMember.image} onChange={handleInputChange} />
        <button onClick={handleAddMember}>Add Member</button>
      </div>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} ({member.role})
            <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembers;
