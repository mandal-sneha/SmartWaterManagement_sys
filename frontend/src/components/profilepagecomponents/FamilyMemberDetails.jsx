import React from 'react';
import { FaUsers, FaChevronDown, FaChevronUp, FaCheck, FaTimes } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";

const FamilyMemberDetails = ({
  familyMembers,
  expandedMember,
  toggleMemberExpansion,
  handleDeleteMember,
  showAddMember,
  setShowAddMember,
  newMemberUserId,
  setNewMemberUserId,
  handleAddMember,
  colors
}) => {

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
            </div>
            <button 
              onClick={() => setShowAddMember(!showAddMember)} 
              className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl" 
              title="Add Family Member"
            >
              <IoIosPersonAdd size={18} />
            </button>
          </div>
        </div>

        <div className="p-6" style={{ minHeight: showAddMember ? '400px' : 'auto' }}>
          {showAddMember && (
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IoIosPersonAdd className="text-blue-600" size={20} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Add New Family Member</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <input 
                    type="text" 
                    placeholder="Enter User ID (e.g., USR004)" 
                    value={newMemberUserId} 
                    onChange={(e) => setNewMemberUserId(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleAddMember} 
                    disabled={!newMemberUserId.trim()} 
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FaCheck size={14} />Add Member
                  </button>
                  <button 
                    onClick={() => { setShowAddMember(false); setNewMemberUserId(''); }} 
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg hover:from-gray-600 hover:to-slate-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <FaTimes size={14} />Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {familyMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaUsers size={32} className="mx-auto mb-2 opacity-50" />
                <p>No family members found</p>
              </div>
            ) : (
              familyMembers.map(member => (
                <div key={member.userId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" 
                    onClick={() => toggleMemberExpansion(member.userId)}
                  >
                    <div className="flex items-center gap-3">
                      {member.userProfilePhoto ? (
                        <img 
                          src={member.userProfilePhoto} 
                          alt={member.userName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg bg-gradient-to-br from-purple-400 to-pink-500 shadow-sm">
                          {member.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{member.userName}</h4>
                        <p className="text-sm text-gray-500">ID: {member.userId}</p>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {expandedMember === member.userId ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                    </div>
                  </div>
                  {expandedMember === member.userId && (
                    <div className="px-4 pb-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50">
                      <div className="space-y-3 mt-4 text-sm">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600 font-medium">User ID:</span>
                          <span className="text-gray-900 font-semibold col-span-2">{member.userId}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600 font-medium">Aadhar:</span>
                          <span className="text-gray-900 font-semibold col-span-2">{member.aadharNo}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-600 font-medium">Email:</span>
                          <span className="text-gray-900 font-semibold col-span-2 break-all">{member.email}</span>
                        </div>
                        <div className="flex justify-center pt-4 border-t border-gray-200">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.userId); }} 
                            className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg" 
                            title="Delete Member"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberDetails;