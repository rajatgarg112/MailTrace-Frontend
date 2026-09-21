import React from 'react';
import { ShieldCheck, Cpu, Compass, Sparkles } from 'lucide-react';
import { DATA_PROVENANCE } from '../../utils/constants';

/**
 * ProvenanceBadge Component
 * 
 * Explicitly distinguishes data origin:
 * 1. Verified Evidence (Raw cryptographic hashes, DKIM/SPF headers, raw server logs)
 * 2. Derived Analysis (Calculated metrics, correlated findings)
 * 3. Approximate Information (Geolocation, IP range estimates, network hops)
 * 4. Model Prediction (ML/NLP model outputs, phishing confidence scores)
 * 
 * CRITICAL RULE: Model predictions must never be presented as verified evidence.
 */
export function ProvenanceBadge({ provenance = 'VERIFIED_EVIDENCE', showIcon = true, size = 'small', className = '', ...props }) {
  // Normalize input string or key
  let typeKey = 'VERIFIED_EVIDENCE';
  const provenanceStr = String(provenance).toUpperCase().replace(/\s+/g, '_');

  if (provenanceStr.includes('VERIFIED') || provenanceStr.includes('EVIDENCE')) {
    typeKey = 'VERIFIED_EVIDENCE';
  } else if (provenanceStr.includes('DERIVED') || provenanceStr.includes('ANALYSIS')) {
    typeKey = 'DERIVED_ANALYSIS';
  } else if (provenanceStr.includes('APPROXIMATE') || provenanceStr.includes('INFO') || provenanceStr.includes('GEO')) {
    typeKey = 'APPROXIMATE_INFO';
  } else if (provenanceStr.includes('MODEL') || provenanceStr.includes('PREDICTION') || provenanceStr.includes('ML')) {
    typeKey = 'MODEL_PREDICTION';
  }

  let config = {
    label: DATA_PROVENANCE.VERIFIED_EVIDENCE,
    icon: ShieldCheck,
    cssClass: 'provenance-verified',
    tooltip: 'Immutable cryptographic or raw server record',
  };

  switch (typeKey) {
    case 'VERIFIED_EVIDENCE':
      config = {
        label: DATA_PROVENANCE.VERIFIED_EVIDENCE,
        icon: ShieldCheck,
        cssClass: 'provenance-verified',
        tooltip: 'Verified Evidence: Immutable cryptographic header or log proof',
      };
      break;
    case 'DERIVED_ANALYSIS':
      config = {
        label: DATA_PROVENANCE.DERIVED_ANALYSIS,
        icon: Cpu,
        cssClass: 'provenance-derived',
        tooltip: 'Derived Analysis: Security engine rule or heuristic output',
      };
      break;
    case 'APPROXIMATE_INFO':
      config = {
        label: DATA_PROVENANCE.APPROXIMATE_INFO,
        icon: Compass,
        cssClass: 'provenance-approximate',
        tooltip: 'Approximate Information: Network/infrastructure estimation (e.g. IP Geolocation)',
      };
      break;
    case 'MODEL_PREDICTION':
      config = {
        label: DATA_PROVENANCE.MODEL_PREDICTION,
        icon: Sparkles,
        cssClass: 'provenance-prediction',
        tooltip: 'Model Prediction: Probabilistic ML model inference (not immutable evidence)',
      };
      break;
  }

  const IconComponent = config.icon;

  return (
    <span 
      className={`provenance-badge provenance-badge-${size} ${config.cssClass} ${className}`}
      title={config.tooltip}
      {...props}
    >
      {showIcon && <IconComponent size={size === 'large' ? 14 : 12} className="provenance-icon" />}
      <span className="provenance-label">{config.label}</span>
    </span>
  );
}

export default ProvenanceBadge;
