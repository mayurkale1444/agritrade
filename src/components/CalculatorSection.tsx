import React from 'react';
import { MarketData } from '../types';
import { ProfitCalculator } from './ProfitCalculator';

interface CalculatorSectionProps {
  marketData: MarketData;
  onNavigateToMarkets?: () => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  marketData,
  onNavigateToMarkets
}) => {
  const modalPrice = marketData.modalPrice || marketData.currentPrice;

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Embedded Profit Calculator Component */}
      <ProfitCalculator
        key={`${marketData.commodity.id}-${marketData.mandi.id}-${modalPrice}`}
        currentPrice={modalPrice}
        commodityName={marketData.commodity.name}
        mandiName={marketData.mandi.name}
        mandiDistrict={marketData.mandi.district}
        mandiState={marketData.mandi.state}
        unit={marketData.commodity.unit}
      />
    </div>
  );
};
