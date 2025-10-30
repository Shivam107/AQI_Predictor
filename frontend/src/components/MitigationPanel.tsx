import React, { useState, useEffect } from 'react';
import { getMitigationAdvice } from '../api';

const MitigationPanel: React.FC<{ aqi?: number }> = ({ aqi = 175 }) => {
  const [advice, setAdvice] = useState<any>(null);

  useEffect(() => {
    getMitigationAdvice(aqi).then((result) => setAdvice(result));
  }, [aqi]);

  return (
    <div className="mitigation-panel">
      <h3>Mitigation Advice</h3>
      {advice ? (
        <div>
          <p><strong>AQI:</strong> {advice.AQI}</p>
          <p><strong>Category:</strong> {advice.Category}</p>
          <p><strong>Warnings:</strong> {advice.Warnings && advice.Warnings.join(', ')}</p>
          <p><strong>Actions:</strong> {advice.Actions && advice.Actions.join(', ')}</p>
        </div>
      ) : (
        <p>Loading advice...</p>
      )}
    </div>
  );
};

export default MitigationPanel;


