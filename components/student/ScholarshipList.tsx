import React from 'react';
import { ScoredScholarship, User } from '../../types';
import ScholarshipCard from './ScholarshipCard';

interface ScholarshipListProps {
  scholarships: ScoredScholarship[];
  user: User;
}

const ScholarshipList: React.FC<ScholarshipListProps> = ({ scholarships, user }) => {
  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <ScholarshipCard key={scholarship.id} scholarship={scholarship} user={user} />
      ))}
    </div>
  );
};

export default ScholarshipList;