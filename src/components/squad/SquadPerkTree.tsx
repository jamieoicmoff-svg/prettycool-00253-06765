import React from 'react';
import { EnhancedPerkTree } from './EnhancedPerkTree';

interface SquadPerkTreeProps {
  memberId: string;
  onClose: () => void;
}

export const SquadPerkTree: React.FC<SquadPerkTreeProps> = ({ memberId, onClose }) => {
  return <EnhancedPerkTree memberId={memberId} onClose={onClose} />;
};
