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

  // Extract all distinct attribute keys across variants
  const attributeKeysMap: Record<string, Set<string>> = {};

  variants.forEach((v) => {
    if (v.attributes && Array.isArray(v.attributes)) {
      v.attributes.forEach((attr) => {
        if (!attributeKeysMap[attr.name]) {
          attributeKeysMap[attr.name] = new Set();
        }
        attributeKeysMap[attr.name].add(attr.value);
      });
    }
  });

  const attributeKeys = Object.keys(attributeKeysMap);

  // Default selection to first available active variant
  useEffect(() => {
    if (variants.length > 0) {
      const activeVar = variants.find((v) => v.stockQuantity > 0 && v.status === 'active') || variants[0];
      if (activeVar && activeVar.attributes) {
        const initialOpts: Record<string, string> = {};
        activeVar.attributes.forEach((attr) => {
          initialOpts[attr.name] = attr.value;
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
    return variants.find((v) => {
      if (!v.attributes) return false;
      return Object.entries(opts).every(([key, val]) =>
        v.attributes?.some((a) => a.name === key && a.value === val)
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
