import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { SQUAD_PERKS, SquadPerk } from '@/data/SquadPerks';
import { X, Lock, Star, Zap, Shield, Eye, Users, Plus } from 'lucide-react';

// Import vault boy perk images
import vaultBoySteadyAim from '@/assets/perks/vault-boy-steady-aim.png';
import vaultBoyHardened from '@/assets/perks/vault-boy-hardened.png';
import vaultBoyCombatDrills from '@/assets/perks/vault-boy-combat-drills.png';
import vaultBoyEagleFocus from '@/assets/perks/vault-boy-eagle-focus.png';
import vaultBoyTrailGhost from '@/assets/perks/vault-boy-trail-ghost.png';
import vaultBoyFieldMedic from '@/assets/perks/vault-boy-field-medic.png';
import vaultBoyDeadlyPrecision from '@/assets/perks/vault-boy-deadly-precision.png';
import vaultBoyBulwark from '@/assets/perks/vault-boy-bulwark.png';
import vaultBoyResilience from '@/assets/perks/vault-boy-resilience.png';
import vaultBoyAdrenalSurge from '@/assets/perks/vault-boy-adrenal-surge.png';
import vaultBoyRelentless from '@/assets/perks/vault-boy-relentless.png';
import vaultBoyStalker from '@/assets/perks/vault-boy-stalker.png';
import perkTreeBg from '@/assets/perk-tree-background.jpg';

interface EnhancedPerkTreeProps {
  memberId: string;
  onClose: () => void;
}

// Vault boy perk image mapping
const PERK_IMAGES: Record<string, string> = {
  'steady-aim': vaultBoySteadyAim,
  'hardened': vaultBoyHardened,
  'combat-drills': vaultBoyCombatDrills,
  'eagle-focus': vaultBoyEagleFocus,
  'trail-ghost': vaultBoyTrailGhost,
  'field-medic-i': vaultBoyFieldMedic,
  'field-medic-ii': vaultBoyFieldMedic,
  'deadly-precision': vaultBoyDeadlyPrecision,
  'bulwark-i': vaultBoyBulwark,
  'resilience': vaultBoyResilience,
  'adrenal-surge': vaultBoyAdrenalSurge,
  'relentless': vaultBoyRelentless,
  'stalker': vaultBoyStalker,
};

const PATH_COLORS = {
  assault: 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 hover:border-destructive/50',
  marksman: 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50',
  defender: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50',
  scout: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50',
  support: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50'
};

const PATH_ICONS = {
  assault: Zap,
  marksman: Eye,
  defender: Shield,
  scout: Star,
  support: Users
};

export const EnhancedPerkTree: React.FC<EnhancedPerkTreeProps> = ({ memberId, onClose }) => {
  const { gameState, chooseSquadPerk } = useGame();
  const { squad } = gameState;
  const member = squad.find(m => m.id === memberId);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  if (!member) return null;

  const owned = new Set(member.perks || []);
  const points = member.perkPoints || 0;

  const canSelect = (perk: SquadPerk) => {
    if (owned.has(perk.id) || points <= 0) return false;
    const levelReq = perk.requires?.level ?? 1;
    if ((member.level || 1) < levelReq) return false;
    const prior = perk.requires?.perks || [];
    return prior.every((p: string) => owned.has(p));
  };

  const onPick = (perkId: string) => {
    if (points <= 0) return;
    chooseSquadPerk(member.id, perkId);
  };

  // Group perks by path
  const perksByPath = SQUAD_PERKS.reduce((acc, perk) => {
    const path = perk.path || 'general';
    if (!acc[path]) acc[path] = [];
    acc[path].push(perk);
    return acc;
  }, {} as Record<string, SquadPerk[]>);

  const filteredPerks = selectedPath 
    ? perksByPath[selectedPath] || []
    : SQUAD_PERKS;

  return (
    <div className="fixed inset-0 z-50 min-h-screen animate-fade-in">
      {/* Full screen background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${perkTreeBg})`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
      
      <div className="relative glass-effect border-2 border-primary/50 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-primary/30 animate-scale-in backdrop-blur-xl bg-background/30">
        
        {/* Combat-style Header */}
        <div className="bg-gradient-to-r from-primary/30 to-primary/20 border-b-2 border-primary/50 p-6 animate-gradient backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center border-3 border-primary/60 shadow-lg shadow-primary/50">
                <span className="text-3xl font-bold text-primary font-mono">{member.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary font-mono tracking-wider drop-shadow-lg">
                  PERK TREE • {member.name.toUpperCase()}
                </h2>
                <div className="flex items-center space-x-6 mt-2">
                  <span className="text-lg text-foreground font-mono bg-muted/30 px-3 py-1 rounded-lg border border-primary/30">
                    LEVEL: {member.level || 1}
                  </span>
                  <div className="flex items-center space-x-3 bg-primary/20 px-4 py-2 rounded-lg border border-primary/50 shadow-lg">
                    <Plus className="text-primary animate-pulse" size={20} />
                    <span className="text-xl font-bold text-primary font-mono drop-shadow-md">
                      {points} POINTS
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg hover-scale"
              aria-label="Close perk tree"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Combat-style Path Selection */}
        <div className="p-6 border-b-2 border-primary/30 bg-background/20 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedPath(null)}
              className={`px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all hover-scale border-2 ${
                !selectedPath 
                  ? 'bg-primary/40 border-primary/70 text-primary shadow-lg shadow-primary/30' 
                  : 'bg-muted/30 border-muted/50 hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              ALL PATHS
            </button>
            {Object.keys(PATH_COLORS).map(path => {
              const Icon = PATH_ICONS[path as keyof typeof PATH_ICONS];
              return (
                <button
                  key={path}
                  onClick={() => setSelectedPath(path)}
                  className={`px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all hover-scale flex items-center space-x-3 border-2 ${
                    selectedPath === path 
                      ? PATH_COLORS[path as keyof typeof PATH_COLORS] + ' shadow-lg'
                      : 'bg-muted/30 border-muted/50 hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Icon size={16} />
                  <span className="tracking-wider">{path.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Combat-style Perk Grid */}
        <div className="p-8 overflow-y-auto max-h-[65vh] backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerks.map(perk => {
              const ownedPerk = owned.has(perk.id);
              const selectable = canSelect(perk);
              const locked = !ownedPerk && !selectable;
              const pathColor = perk.path ? PATH_COLORS[perk.path as keyof typeof PATH_COLORS] : 'bg-muted/20 border-border';
              const perkImage = PERK_IMAGES[perk.id];

              return (
                <div 
                  key={perk.id} 
                  className={`group relative p-5 rounded-xl border-3 transition-all duration-300 cursor-pointer hover-scale backdrop-blur-sm ${
                    ownedPerk 
                      ? 'bg-green-500/30 border-green-500/70 shadow-xl shadow-green-500/30 animate-bounce-in' 
                      : selectable 
                        ? `${pathColor} hover:scale-105 hover:shadow-xl hover-lift animate-fade-in border-opacity-70 shadow-lg`
                        : 'bg-muted/20 border-muted/40 opacity-60 animate-fade-in'
                  }`}
                >
                  {/* Rarity indicator */}
                  {perk.rarity && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold animate-fade-in ${
                      perk.rarity === 'legendary' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                      perk.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                      'bg-muted/20 text-muted-foreground border border-border'
                    }`}>
                      {perk.rarity.toUpperCase()}
                    </div>
                  )}

                  {/* Combat-style Vault Boy Image */}
                  <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center border-3 border-primary/60 overflow-hidden group-hover:scale-110 hover:animate-pulse-glow transition-all duration-300 shadow-lg shadow-primary/30">
                    {perkImage ? (
                        <img 
                          src={perkImage} 
                          alt={perk.name} 
                          className="w-20 h-20 object-cover rounded-full filter brightness-125 contrast-125 saturate-125 hover:brightness-150 transition-all duration-300 drop-shadow-lg"
                        />
                    ) : perk.path && PATH_ICONS[perk.path as keyof typeof PATH_ICONS] ? (
                      React.createElement(PATH_ICONS[perk.path as keyof typeof PATH_ICONS], { size: 32, className: "text-primary drop-shadow-md" })
                    ) : (
                      <Star size={32} className="text-primary drop-shadow-md" />
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-bold text-base mb-3 font-mono tracking-wider text-foreground drop-shadow-sm">
                      {perk.name.toUpperCase()}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3 font-mono leading-relaxed group-hover:text-foreground transition-colors">
                      {perk.description}
                    </p>

                    {/* Effects */}
                    <div className="space-y-1 mb-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      {Object.entries(perk.effects).map(([effect, value]) => (
                        <div key={effect} className="text-xs font-mono flex justify-between">
                          <span className="text-muted-foreground">{effect.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <span className="text-green-400">
                            {typeof value === 'number' && value < 1 ? `${Math.round((value - 1) * 100)}%` :
                             typeof value === 'number' && effect.includes('Add') ? `+${value}` :
                             value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Requirements */}
                    {perk.requires && (
                      <div className="text-xs text-muted-foreground mb-3 font-mono">
                        <div>REQ: Level {perk.requires.level || 1}</div>
                        {perk.requires.perks && (
                          <div>PERKS: {perk.requires.perks.join(', ')}</div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-center">
                      {ownedPerk ? (
                        <div className="flex items-center text-green-400 text-sm font-mono">
                          <Star className="mr-1" size={14} fill="currentColor" />
                          OWNED
                        </div>
                      ) : selectable ? (
                        <button
                          onClick={() => onPick(perk.id)}
                          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg text-primary text-sm font-bold font-mono transition-all hover:scale-105 hover:shadow-lg hover:animate-pulse-glow animate-bounce-in"
                        >
                          SELECT PERK
                        </button>
                      ) : (
                        <div className="flex items-center text-destructive text-sm font-mono">
                          <Lock className="mr-1" size={14} />
                          LOCKED
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Combat-style Footer */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/30 border-t-2 border-primary/50 p-4 backdrop-blur-sm">
          <p className="text-center text-sm text-foreground font-mono font-bold tracking-wider drop-shadow-sm">
            VAULT-TEC APPROVED ENHANCEMENT SYSTEM • AUTHORIZATION LEVEL: COMMANDER
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};