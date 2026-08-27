import React, { useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import CommunityPortal from '../components/community/CommunityPortal';

export default function CommunityPage() {
  const { loadFullEcosystemData } = useAppState();

  useEffect(() => {
    loadFullEcosystemData();
  }, []);

  return (
    <div className="py-6">
      <CommunityPortal />
    </div>
  );
}
