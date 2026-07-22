import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';

interface DataTableProps<T extends GridValidRowModel> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  rowCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  checkboxSelection?: boolean;
}

export function DataTable<T extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  rowCount,
  page = 0,
  onPageChange,
  checkboxSelection = false,
}: DataTableProps<T>) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pagination
          paginationMode={rowCount !== undefined ? 'server' : 'client'}
          rowCount={rowCount}
          pageSizeOptions={[5, 10, 20, 50]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            if (onPageChange) onPageChange(model.page);
          }}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
          }}
        />
      </Box>
    </Paper>
  );
}
