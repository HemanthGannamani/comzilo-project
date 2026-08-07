/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Paper, Alert } from '@mui/material';
import { Check } from 'lucide-react';

export interface VariantItem {
  id: number;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  status: string;
  attributes?: { name: string; value: string }[];
  images?: { imageUrl: string; isPrimary?: boolean }[];
}

interface Props {
  productId: number | string;
  variants: VariantItem[];
  onSelectVariant: (variant: VariantItem | null) => void;
}

export const VariantSelector: React.FC<Props> = ({ variants, onSelectVariant }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!variants || variants.length === 0) return null;

  // Helper to extract attribute name and value cleanly with name normalization
  const normalizeKey = (key: string): string => {
    const k = key.trim().toLowerCase();
    if (k === 'ram') return 'RAM';
    if (k === 'memory' || k === 'storage') return 'Memory';
    if (k === 'colour' || k === 'color') return 'Colour';
    if (k === 'size') return 'Size';
    if (k === 'material') return 'Material';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getAttrName = (attr: any) => normalizeKey(attr?.name || attr?.attributeName || attr?.attribute_value_name || attr?.attribute_name || '');
  const getAttrValue = (attr: any) => attr?.value || attr?.attributeValue || attr?.attribute_value || '';

  // Process variants to guarantee attribute arrays (parse SKU tags as fallback if attributes array is empty)
  const processedVariants = variants.map((v) => {
    let attrs = v.attributes ? [...v.attributes] : [];

    // Fallback: If attributes array is empty, attempt parsing SKU tags (e.g. VAR-SKU-8GB-16GB-BLACK)
    if (attrs.length === 0 && v.sku && v.sku.includes('-')) {
      const parts = v.sku.split('-');
      if (parts.length >= 4) {
        const potentialRam = parts[parts.length - 3];
        const potentialMem = parts[parts.length - 2];
        const potentialCol = parts[parts.length - 1];

        if (potentialRam) attrs.push({ name: 'RAM', value: potentialRam });
        if (potentialMem) attrs.push({ name: 'Memory', value: potentialMem });
        if (potentialCol) attrs.push({ name: 'Colour', value: potentialCol });
      }
    }

    return { ...v, attributes: attrs };
  });

  // Extract all distinct attribute keys across variants
  const attributeKeysMap: Record<string, Set<string>> = {};

  processedVariants.forEach((v) => {
    if (v.attributes && Array.isArray(v.attributes)) {
      v.attributes.forEach((attr) => {
        const key = getAttrName(attr);
        const val = getAttrValue(attr);
        if (key && val) {
          if (!attributeKeysMap[key]) {
            attributeKeysMap[key] = new Set();
          }
          attributeKeysMap[key].add(val);
        }
      });
    }
  });

  const attributeKeys = Object.keys(attributeKeysMap);

  // Default selection to first available active variant
  useEffect(() => {
    if (processedVariants.length > 0) {
      const activeVar = processedVariants.find((v) => Number(v.stockQuantity) > 0) || processedVariants[0];
      if (activeVar && activeVar.attributes) {
        const initialOpts: Record<string, string> = {};
        activeVar.attributes.forEach((attr) => {
          const key = getAttrName(attr);
          const val = getAttrValue(attr);
          if (key && val) initialOpts[key] = val;
        });
        setSelectedOptions(initialOpts);
        onSelectVariant(activeVar);
      } else {
        onSelectVariant(activeVar);
      }
    }
  }, [variants]);

  // Find matching variant based on current selectedOptions
  const findMatchingVariant = (opts: Record<string, string>) => {
    return processedVariants.find((v) => {
      if (!v.attributes) return false;
      return Object.entries(opts).every(([key, val]) =>
        v.attributes?.some((a) => getAttrName(a) === key && getAttrValue(a).toLowerCase() === val.toLowerCase())
      );
    });
  };

  const handleSelectOption = (key: string, val: string) => {
    const updated = { ...selectedOptions, [key]: val };
    setSelectedOptions(updated);

    const matched = findMatchingVariant(updated);
    onSelectVariant(matched || null);
  };

  return (
    <Box sx={{ my: 3 }}>
      {attributeKeys.map((key) => {
        const values = Array.from(attributeKeysMap[key]);
        const currentSelected = selectedOptions[key];

        return (
          <Box key={key} sx={{ mb: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              Select {key}: <span style={{ color: '#2563EB', fontWeight: 600 }}>{currentSelected}</span>
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {values.map((val) => {
                const isSelected = currentSelected === val;

                // Check if this option has stock in any variant matching current selections
                const tempOpts = { ...selectedOptions, [key]: val };
                const tempMatched = findMatchingVariant(tempOpts);
                const isOutOfStock = !tempMatched || tempMatched.stockQuantity <= 0;

                return (
                  <Button
                    key={val}
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={isSelected ? 'primary' : 'inherit'}
                    disabled={isOutOfStock}
                    onClick={() => handleSelectOption(key, val)}
                    startIcon={isSelected ? <Check size={14} /> : undefined}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 2,
                      borderColor: isSelected ? '#2563EB' : '#CBD5E1',
                      bgcolor: isSelected ? '#2563EB' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      opacity: isOutOfStock ? 0.4 : 1,
                      textDecoration: isOutOfStock ? 'line-through' : 'none',
                      '&:hover': {
                        bgcolor: isSelected ? '#1D4ED8' : '#F8FAFC',
                      },
                    }}
                  >
                    {val}
                  </Button>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
