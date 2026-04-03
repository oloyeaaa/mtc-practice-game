'use client';

import { GameProvider, useGame } from './lib/GameContext';
import HUD from './components/HUD';
import ToastContainer from './components/Toast';
import LevelUpOverlay from './components/LevelUpOverlay';
import RewardPopup from './components/RewardPopup';
import MenuScreen from './components/MenuScreen';
import BattleScreen from './components/BattleScreen';
import ShopScreen from './components/ShopScreen';
import PetsScreen from './components/PetsScreen';
import RoundResultScreen from './components/RoundResultScreen';
import AchievementsScreen from './components/AchievementsScreen';

function GameApp() {
  const { state } = useGame();

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* HUD shown on non-menu screens */}
      {state.screen !== 'menu' && <HUD />}

      {/* Screens */}
      {state.screen === 'menu' && <MenuScreen />}
      {state.screen === 'battle' && <BattleScreen />}
      {state.screen === 'shop' && <ShopScreen />}
      {state.screen === 'pets' && <PetsScreen />}
      {state.screen === 'results' && <RoundResultScreen />}
      {state.screen === 'achievements' && <AchievementsScreen />}

      {/* Overlays */}
      <LevelUpOverlay />
      <RewardPopup />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
