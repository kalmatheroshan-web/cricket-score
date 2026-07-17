import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,  
  StatusBar 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ScoreUpdater = () => {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);

  // Core delivery handler
  const registerBall = (runsToAdd = 0) => {
    setRuns((prev) => prev + runsToAdd);
    setBalls((prevBalls) => {
      const nextBalls = prevBalls + 1;
      if (nextBalls === 6) {
        setOvers((prevOvers) => prevOvers + 1);
        return 0;
      }
      return nextBalls;
    });
  };

  const handleWicket = () => {
    if (wickets < 10) {
      setWickets((prev) => prev + 1);
      registerBall(0);
    }
  };

  const handleExtra = (type: 'WD' | 'NB') => {
    setRuns((prev) => prev + 1);
  };

  const resetMatch = () => {
    setRuns(0);
    setWickets(0);
    setOvers(0);
    setBalls(0);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Premium Brand Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>INTERNATIONAL PANEL</Text>
        <Text style={styles.headerTitle}>UMPIRE DASHBOARD</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Luxury Score Pod */}
      <View style={styles.scoreDisplayContainer}>
        <View style={styles.mainScoreWrapper}>
          <Text style={styles.runsText}>{runs}</Text>
          <Text style={styles.scoreDivider}>-</Text>
          <Text style={styles.wicketsText}>{wickets}</Text>
        </View>
        <Text style={styles.scoreLabel}>TOTAL SCORE</Text>

        {/* Overs Sub-Panel */}
        <View style={styles.oversBadgeContainer}>
          <View style={styles.oversBadge}>
            <Text style={styles.oversLabel}>OVERS</Text>
            <Text style={styles.oversValue}>{overs}.{balls}</Text>
          </View>
        </View>
      </View>

      {/* Primary Ball Progression Buttons */}
      <View style={styles.mainActionsContainer}>
        <TouchableOpacity 
          style={[styles.actionCard, styles.dotCard]} 
          onPress={() => registerBall(0)}
        >
          <Text style={styles.dotCardText}>DOT BALL</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, styles.wicketCard]} 
          onPress={handleWicket}
        >
          <Text style={styles.wicketCardText}>WICKET</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Run Increment Grid */}
      <View style={styles.gridContainer}>
        {[1, 2, 3, 4, 6].map((runValue) => (
          <TouchableOpacity
            key={runValue}
            style={[
              styles.gridButton, 
              (runValue === 4 || runValue === 6) && styles.boundaryButton
            ]}
            onPress={() => registerBall(runValue)}
          >
            <Text style={[
              styles.gridButtonText,
              (runValue === 4 || runValue === 6) && styles.boundaryButtonText
            ]}>
              +{runValue}
            </Text>
            <Text style={styles.gridButtonSub}>
              {runValue === 4 ? 'FOUR' : runValue === 6 ? 'SIX' : 'RUNS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Official Penalty & Extras Utilities */}
      <View style={styles.extrasContainer}>
        <TouchableOpacity style={styles.extrasButton} onPress={() => handleExtra('WD')}>
          <Text style={styles.extrasButtonText}>WIDE (WD)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.extrasButton} onPress={() => handleExtra('NB')}>
          <Text style={styles.extrasButtonText}>NO BALL (NB)</Text>
        </TouchableOpacity>
      </View>

      {/* Subtle Structural Reset Option */}
      <TouchableOpacity style={styles.resetButton} onPress={resetMatch}>
        <Text style={styles.resetButtonText}>RESET SESSION</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F', // Ultra dark luxury background
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 15,
  },
  headerSubtitle: {
    color: '#FF6B00', // Premium vibrant orange accent
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 1,
    marginTop: 4,
  },
  headerLine: {
    width: 40,
    height: 2,
    backgroundColor: '#FF6B00',
    marginTop: 12,
    borderRadius: 1,
  },
  scoreDisplayContainer: {
    backgroundColor: '#12141C',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1E2230',
    paddingVertical: 35,
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative',
  },
  mainScoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runsText: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '200',
  },
  scoreDivider: {
    color: '#FF6B00',
    fontSize: 50,
    marginHorizontal: 20,
    fontWeight: '200',
    opacity: 0.8,
  },
  wicketsText: {
    color: '#FFFFFF',
    fontSize: 80,
    fontWeight: '400',
  },
  scoreLabel: {
    color: '#4E5569',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 5,
  },
  oversBadgeContainer: {
    position: 'absolute',
    bottom: -18,
  },
  oversBadge: {
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  oversLabel: {
    color: '#090A0F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 6,
  },
  oversValue: {
    color: '#090A0F',
    fontSize: 16,
    fontWeight: '800',
  },
  mainActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dotCard: {
    backgroundColor: '#12141C',
    borderColor: '#1E2230',
  },
  dotCardText: {
    color: '#8E9AA8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  wicketCard: {
    backgroundColor: '#1A0F0F',
    borderColor: '#3D1C1C',
  },
  wicketCardText: {
    color: '#FF4545',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  gridButton: {
    width: '31%', 
    backgroundColor: '#12141C',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2230',
  },
  boundaryButton: {
    borderColor: '#FF6B00',
    backgroundColor: '#1C130D',
  },
  gridButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  boundaryButtonText: {
    color: '#FF6B00',
  },
  gridButtonSub: {
    color: '#4E5569',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  extrasContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },
  extrasButton: {
    flex: 1,
    backgroundColor: '#090A0F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2230',
  },
  extrasButtonText: {
    color: '#6C768A',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  resetButtonText: {
    color: '#363B4A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

export default ScoreUpdater;