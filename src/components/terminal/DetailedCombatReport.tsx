import React from 'react';
import { CombatSynchronizer } from '@/utils/CombatSynchronizer';
import { useGame } from '@/context/GameContext';
import { Shield, Target, Zap, Heart, Brain, Eye, Clock, MapPin, Users, Award } from 'lucide-react';

interface DetailedCombatReportProps {
  missionId: string;
  onClose: () => void;
}

export const DetailedCombatReport: React.FC<DetailedCombatReportProps> = ({ missionId, onClose }) => {
  const { gameState } = useGame();
  const sync = CombatSynchronizer.getInstance();
  const report = sync.getCombatReport(missionId);
  const mission = [...gameState.activeMissions, ...gameState.completedMissions].find(m => m.id === missionId);

  if (!report || !mission) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 font-mono">COMBAT REPORT NOT AVAILABLE</p>
        <p className="text-gray-400 text-sm font-mono mt-2">Data may still be processing or unavailable.</p>
      </div>
    );
  }

  const participants = gameState.squad.filter(m => mission.assignedSquad.includes(m.id));
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceGrade = (damage: number, accuracy: number) => {
    const score = (damage / 100) + (accuracy / 100);
    if (score >= 1.8) return { grade: 'S', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score >= 1.5) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 1.2) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 0.8) return { grade: 'C', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black/90 border-2 border-green-500/30 rounded-xl font-mono">
      {/* Classification Header */}
      <div className="bg-red-600/20 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-red-400 font-bold text-xl tracking-wider">
              ★ CLASSIFIED ★ AFTER-ACTION REPORT ★ CLASSIFIED ★
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              OPERATION: {mission.title?.toUpperCase() || 'UNKNOWN'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 px-3 py-1 border border-red-500/30 rounded"
          >
            [CLOSE]
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Overview */}
        <div className="lg:col-span-2">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <h2 className="text-green-400 font-bold mb-3 flex items-center">
              <Target className="mr-2" size={18} />
              MISSION SUMMARY
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">LOCATION:</span>
                <span className="text-white ml-2 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {mission.location || 'CLASSIFIED'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">DURATION:</span>
                <span className="text-white ml-2 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatTime(report.actualDuration)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">STATUS:</span>
                <span className={`ml-2 font-bold ${report.victory ? 'text-green-400' : 'text-red-400'}`}>
                  {report.victory ? '✓ MISSION SUCCESS' : '✗ MISSION FAILED'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">PARTICIPANTS:</span>
                <span className="text-white ml-2 flex items-center">
                  <Users size={12} className="mr-1" />
                  {participants.length} OPERATIVES
                </span>
              </div>
            </div>
          </div>

          {/* Combat Timeline */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h2 className="text-blue-400 font-bold mb-3 flex items-center">
              <Clock className="mr-2" size={18} />
              TACTICAL TIMELINE
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {report.events && report.events.slice(-20).map((event, index) => (
                <div key={`${event.id}-${index}`} className="text-xs bg-black/40 p-2 rounded border-l-2 border-blue-500/50">
                  <span className="text-blue-400">[{formatTime(event.timestamp / 1000)}]</span>
                  <span className="text-gray-300 ml-2">{event.description}</span>
                </div>
              ))}
              {(!report.events || report.events.length === 0) && (
                <p className="text-gray-500 text-sm">Detailed combat events not recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Squad Performance */}
        <div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <h2 className="text-yellow-400 font-bold mb-3 flex items-center">
              <Award className="mr-2" size={18} />
              PERFORMANCE GRADES
            </h2>
            <div className="space-y-3">
              {participants.map(member => {
                const finalHealth = report.finalHealths[member.id] || 0;
                const healthPercent = Math.max(0, Math.round((finalHealth / member.stats.maxHealth) * 100));
                const mockDamage = Math.floor(Math.random() * 200) + 50;
                const mockAccuracy = Math.floor(Math.random() * 40) + 60;
                const grade = getPerformanceGrade(mockDamage, mockAccuracy);

                return (
                  <div key={member.id} className="bg-black/40 p-3 rounded border border-gray-600/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">{member.name}</span>
                      <div className={`px-2 py-1 rounded ${grade.bg} ${grade.color} font-bold`}>
                        {grade.grade}
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Health:</span>
                        <span className={healthPercent > 50 ? 'text-green-400' : healthPercent > 20 ? 'text-yellow-400' : 'text-red-400'}>
                          {healthPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Damage Dealt:</span>
                        <span className="text-white">{mockDamage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className="text-white">{mockAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reports */}
      <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
        <h2 className="text-gray-300 font-bold mb-4 flex items-center">
          <Users className="mr-2" size={18} />
          OPERATIVE DEBRIEFS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map(member => {
            const finalHealth = report.finalHealths[member.id] || 0;
            const survived = finalHealth > 0;
            
            return (
              <div key={member.id} className="bg-black/40 p-4 rounded border border-gray-600/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-bold">{member.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${survived ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {survived ? 'OPERATIONAL' : 'KIA/WOUNDED'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-300 mb-3">
                  <strong>Personal Account:</strong>
                </div>
                
                <blockquote className="text-xs text-gray-400 italic border-l-2 border-gray-600 pl-3 leading-relaxed">
                  {survived ? 
                    `"Operation went according to plan. ${report.victory ? 'Targets neutralized efficiently. ' : 'Encountered unexpected resistance. '}Equipment performed within expected parameters. Ready for next deployment."` :
                    `"Took heavy fire during the engagement. ${report.victory ? 'Mission objective achieved despite casualties. ' : 'Unable to complete primary objective. '}Recommend tactical review before future operations."`
                  }
                </blockquote>
                
                <div className="mt-3 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Specialization:</span>
                    <span className="text-white">{member.specialization?.toUpperCase() || 'GENERAL'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={finalHealth > 50 ? 'text-green-400' : finalHealth > 0 ? 'text-yellow-400' : 'text-red-400'}>
                      {Math.max(0, Math.round((finalHealth / member.stats.maxHealth) * 100))}% HEALTH
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classification Footer */}
      <div className="mt-6 pt-4 border-t border-gray-600 text-center">
        <p className="text-xs text-gray-500">
          CLASSIFIED DOCUMENT - AUTHORIZED PERSONNEL ONLY<br/>
          DISTRIBUTION: COMMANDER LEVEL AND ABOVE<br/>
          FILE ID: AAR-{missionId.toUpperCase()}-{new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};