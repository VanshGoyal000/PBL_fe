import React, { useState, useEffect } from 'react';
import '../App.css'
export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showMyGroups, setShowMyGroups] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [hasCheckedGroups, setHasCheckedGroups] = useState(false);

  const [newGroup, setNewGroup] = useState({
    title: '',
    description: '',
    requiredMembers: 3,
    skills: ''
  });
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const [interestedStudents, setInterestedStudents] = useState([]);
  const [showInterestedStudentsModal, setShowInterestedStudentsModal] = useState(false);


  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAcceptStudent = async (requestId, studentId) => {
    try {
      const response = await fetch(`https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/request/${requestId}/accept/${studentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage('Student accepted successfully!');
        fetchGroups();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to accept student');
      }
    } catch (error) {
      setMessage('Error accepting student');
    }
  };

  const viewStudentProfile = (student) => {
    setSelectedProfile(student);
    setIsProfileModalOpen(true);
  };


  const createGroup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newGroup,
          skills: newGroup.skills.split(',').map(s => s.trim())
        })
      });

      if (response.ok) {
        setNewGroup({
          title: '',
          description: '',
          requiredMembers: 3,
          skills: ''
        });
        setIsModalOpen(false);
        fetchGroups();
        setMessage('Group created successfully!');
      }
    } catch (error) {
      setMessage('Error creating group');
    } finally {
      setIsLoading(false);
    }
  };


  const fetchGroups = async () => {
    try {
      const [allGroupsResponse, myGroupsResponse] = await Promise.all([
        fetch('https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/requests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/my-requests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
  
      const allGroups = await allGroupsResponse.json();
      const myGroups = await myGroupsResponse.json();
      console.log('Fetched groups:', { allGroups, myGroups }); // Debug log
  
      setGroups(allGroups);
      setMyGroups(myGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };


  const handleShowInterestedStudents = async (requestId) => {
    try {
      const response = await fetch(`https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/request/${requestId}/interested-students`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setInterestedStudents(data.interestedStudents || []);
      setShowInterestedStudentsModal(true);
    } catch (error) {
      console.error('Error fetching interested students:', error);
      setMessage('Error fetching interested students');
    }
  };

  const handleCloseGroup = async (requestId) => {
    try {
      const response = await fetch(`https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/request/${requestId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        setMessage('Group closed successfully');
        fetchGroups(); // Refresh the groups list
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to close group');
      }
    } catch (error) {
      setMessage('Error closing group');
    }

    setTimeout(() => setMessage(''), 3000);
};

const handleShowInterest = async (requestId) => {
    try {
      const response = await fetch(`https://fd333eaa-97c0-4445-838b-53f918826c10-dev.e1-us-east-azure.choreoapis.dev/default/pbl/v1.0/api/groups/request/${requestId}/interest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Interest shown successfully!');
        fetchGroups(); // Refresh the groups list
      } else {
        setMessage(data.message || 'Failed to show interest');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error showing interest');
    }
  
    setTimeout(() => setMessage(''), 3000);
  };

const getUserId = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('No userId found in localStorage');
      return null;
    }
    return userId;
  };
  
  const isCreator = (group) => {
    const userId = localStorage.getItem('userId');
    return group?.creator?._id && userId && group.creator._id === userId;
  };

  const filterMyGroups = (groups) => {
    return groups.filter(group => {
      const userId = localStorage.getItem('userId');
      return group?.creator?._id && userId && group.creator._id === userId;
    });
  };
  useEffect(() => {
    if (!hasCheckedGroups && groups.length > 0) {
      const myGroups = filterMyGroups(groups);
      if (myGroups.length === 0) {
        setMessage('No Groups!');
      }
      setMessage('');
      setHasCheckedGroups(true);
    }
  }, [groups, hasCheckedGroups]);
  
  
    return (
      <div className="container mx-auto px-4 py-8">
              <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Groups</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowMyGroups(!showMyGroups)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            {showMyGroups ? 'Show All Groups' : 'My Groups'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create New Group
          </button>
        </div>
      </div>

      {/* My Groups Section */}
      {showMyGroups && (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">My Created Groups</h2>
    <div className="grid grid-cols-1 gap-4">
      {groups
        .filter(group => {
            if (!group?.creator) {
                console.warn('Group has no creator:', group);
                return false;
              }
              
              const userId = localStorage.getItem('userId');
              if (!userId) {
                console.warn('No userId found in localStorage');
                return false;
              }
    
              console.log('Comparing:', {
                creatorId: group.creator._id,
                userId: userId
              });
              
              return group.creator._id === userId;
        })
        .map(group => (
          <div key={group._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <p className="text-sm text-gray-500">Required Members: {group.requiredMembers}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {group.skills.map((skill, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleCloseGroup(group._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
              >
                Close Group
              </button>
            </div>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="space-y-4">
              <h4 className="font-medium">Interested Students ({group.interestedStudents.length}):</h4>
              {group.interestedStudents.map(({ student, status, _id }) => (
                <div key={_id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">Section: {student.section}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {status}
                    </span>
                    {status === 'PENDING' && (
                      <button
                        onClick={() => handleAcceptStudent(group._id, student._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {group.interestedStudents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No requests yet</p>
              )}
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {showRequests && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Incoming Requests</h2>
          <div className="grid grid-cols-1 gap-4">
            {groups.filter(group => group.creator._id === localStorage.getItem('userId')).map(group => (
              <div key={group._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
               
                <div className="space-y-4">
                <button
              onClick={() => handleCloseGroup(group._id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
            >
              Close Group
            </button>
            {showInterestedStudentsModal && interestedStudents.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Interested Students</h2>
            <ul>
              {interestedStudents.map(student => (
                <li key={student._id} className="border-b py-2">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  <p className="text-sm text-gray-500">Section: {student.section}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setShowInterestedStudentsModal(false);
                setInterestedStudents([]);
              }}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
  
        {message && (
          <div className="mb-4 p-4 rounded-md bg-green-100 text-green-700">
            {message}
          </div>
        )}
        
  
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
              <form onSubmit={createGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newGroup.title}
                    onChange={(e) => setNewGroup({...newGroup, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Required Members</label>
                  <input
                    type="number"
                    min="3"
                    max="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newGroup.requiredMembers}
                    onChange={(e) => setNewGroup({...newGroup, requiredMembers: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newGroup.skills}
                    onChange={(e) => setNewGroup({...newGroup, skills: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Groups Grid */}
        {!showMyGroups && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {group.skills.map((skill, index) => (
                <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
            
            {isCreator(group) ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCloseGroup(group._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                  >
                    Close Group
                  </button>
                  <button
                    onClick={() => handleShowInterestedStudents(group._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Show Interested Students
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleShowInterest(group._id)}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                disabled={group.interestedStudents?.some(
                  req => req.student === localStorage.getItem('userId')
                )}
              >
                {group.interestedStudents?.some(
                  req => req.student === localStorage.getItem('userId')
                ) ? 'Interest Shown' : 'Show Interest'}
              </button>
            )}
          </div>
        ))}
       
      </div>
       )}

      {/* Profile Modal */}
      {isProfileModalOpen && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="font-medium">Name:</label>
                <p>{selectedProfile.name}</p>
              </div>
              <div>
                <label className="font-medium">Section:</label>
                <p>{selectedProfile.section}</p>
              </div>
              <div>
                <label className="font-medium">Email:</label>
                <p>{selectedProfile.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}