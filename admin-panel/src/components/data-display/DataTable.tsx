import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  rowCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  loading = false,
  rowCount,
  page = 0,
  onPageChange,
  pageSize = 10,
}) => {
  return (
    <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationMode={rowCount !== undefined ? 'server' : 'client'}
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => onPageChange && onPageChange(model.page)}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#F8FAFC',
            fontWeight: 700,
            color: '#475569',
          },
          '& .MuiDataGrid-cell': {
            borderColor: '#F1F5F9',
          },
        }}
      />
    </Paper>
  );
};
