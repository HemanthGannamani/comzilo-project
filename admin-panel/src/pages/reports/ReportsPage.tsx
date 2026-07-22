import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Grid,
} from '@mui/material';
import { FileSpreadsheet, FileText, FileDown, Search } from 'lucide-react';
import {
  useGetSellersReportQuery,
  useGetApplicationsReportQuery,
  useGetTenantsReportQuery,
  useGetStoresReportQuery,
  useGetTenantsQuery,
  useGetStoresQuery,
} from '../../api/adminApi';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch reference lists for filter selectors
  const { data: tenantsRef } = useGetTenantsQuery({ limit: 100 });
  const { data: storesRef } = useGetStoresQuery({ limit: 100 });

  // Fetch reports queries conditionally
  const { data: sellersData, isLoading: loadingSellers } = useGetSellersReportQuery(
    { status, tenantId, storeId, startDate, endDate, search },
    { skip: activeTab !== 0 }
  );

  const { data: appsData, isLoading: loadingApps } = useGetApplicationsReportQuery(
    { status, search },
    { skip: activeTab !== 1 }
  );

  const { data: tenantsData, isLoading: loadingTenants } = useGetTenantsReportQuery(
    { search },
    { skip: activeTab !== 2 }
  );

  const { data: storesData, isLoading: loadingStores } = useGetStoresReportQuery(
    { search },
    { skip: activeTab !== 3 }
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearch('');
    setStatus('');
    setTenantId('');
    setStoreId('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const getReportRows = () => {
    if (activeTab === 0) return sellersData?.data || [];
    if (activeTab === 1) return appsData?.data || [];
    if (activeTab === 2) return tenantsData?.data || [];
    return storesData?.data || [];
  };

  const isLoading = loadingSellers || loadingApps || loadingTenants || loadingStores;
  const rows = getReportRows();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Exporter Functions
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  const getExportData = () => {
    if (activeTab === 0) {
      return {
        headers: ['Seller Name', 'Email', 'Business Name', 'Tenant', 'Store', 'Role', 'Status', 'Created Date'],
        rows: rows.map((r: any) => [
          `${r.firstName || ''} ${r.lastName || ''}`.trim(),
          r.email || '',
          r.profile?.metadata?.businessName || 'N/A',
          r.tenant?.name || 'N/A',
          r.userRoles?.[0]?.store?.name || 'N/A',
          r.userRoles?.[0]?.role?.name || 'N/A',
          r.status || 'N/A',
          new Date(r.createdAt).toLocaleDateString(),
        ]),
        title: 'Sellers_Report',
      };
    }
    if (activeTab === 1) {
      return {
        headers: ['Application Number', 'Business Name', 'Owner Name', 'Email', 'Status', 'Reviewed By', 'Reviewed Date'],
        rows: rows.map((r: any) => [
          r.applicationNumber || '',
          r.businessName || '',
          r.ownerName || '',
          r.email || '',
          r.status || '',
          r.reviewedBy || 'N/A',
          r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString() : 'N/A',
        ]),
        title: 'Applications_Report',
      };
    }
    if (activeTab === 2) {
      return {
        headers: ['ID', 'Organization Name', 'Slug', 'Plan Level', 'Status', 'Created Date'],
        rows: rows.map((r: any) => [
          r.id,
          r.name || '',
          r.slug || '',
          r.plan || '',
          r.status || '',
          new Date(r.createdAt).toLocaleDateString(),
        ]),
        title: 'Tenants_Report',
      };
    }
    return {
      headers: ['ID', 'Store Name', 'Code', 'Tenant organization', 'Created Date'],
      rows: rows.map((r: any) => [
        r.id,
        r.name || '',
        r.code || '',
        r.tenant?.name || 'N/A',
        new Date(r.createdAt).toLocaleDateString(),
      ]),
      title: 'Stores_Report',
    };
  };

  const exportCSV = () => {
    const { headers, rows: dataRows, title } = getExportData();
    const csvContent =
      [headers.join(',')] +
      '\n' +
      dataRows
        .map((row: any) =>
          row.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');
    downloadFile(csvContent, `${title}_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportExcel = () => {
    // Generate simple spreadsheet XML
    const { headers, rows: dataRows, title } = getExportData();
    let xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Sheet1"><Table>';
    
    // Headers Row
    xml += '<Row>';
    headers.forEach((h) => {
      xml += `<Cell><Data ss:Type="String">${h}</Data></Cell>`;
    });
    xml += '</Row>';

    // Data Rows
    dataRows.forEach((row: any) => {
      xml += '<Row>';
      row.forEach((v: any) => {
        xml += `<Cell><Data ss:Type="String">${v}</Data></Cell>`;
      });
      xml += '</Row>';
    });

    xml += '</Table></Worksheet></Workbook>';
    downloadFile(xml, `${title}_${Date.now()}.xls`, 'application/vnd.ms-excel');
  };

  const exportPDF = () => {
    const { headers, rows: dataRows, title } = getExportData();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `<html><head><title>${title.replace(/_/g, ' ')}</title><style>
      body { font-family: sans-serif; padding: 20px; }
      h2 { text-align: center; color: #0F172A; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; font-size: 12px; }
      th { background-color: #F8FAFC; color: #475569; font-weight: bold; }
    </style></head><body>`;

    html += `<h2>${title.replace(/_/g, ' ')}</h2>`;
    html += '<table><thead><tr>';
    headers.forEach((h) => {
      html += `<th>${h}</th>`;
    });
    html += '</tr></thead><tbody>';

    dataRows.forEach((row: any) => {
      html += '<tr>';
      row.forEach((v: any) => {
        html += `<td>${v}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table></body></html>';
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 850, color: '#0F172A', mb: 1 }}>
        Reports Module
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Generate, filter, and export system-wide tabular summaries and logs
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Seller Report" />
          <Tab label="Application Report" />
          <Tab label="Tenant Report" />
          <Tab label="Store Report" />
        </Tabs>
      </Box>

      {/* Filters Form */}
      <Paper sx={{ p: 3, mb: 4, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94A3B8' }} />,
                },
              }}
            />
          </Grid>

          {activeTab === 0 && (
            <>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                    <MenuItem value="disabled">Disabled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tenant</InputLabel>
                  <Select value={tenantId} label="Tenant" onChange={(e) => setTenantId(e.target.value)}>
                    <MenuItem value="">All Tenants</MenuItem>
                    {tenantsRef?.data?.tenants?.map((t: any) => (
                      <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Store</InputLabel>
                  <Select value={storeId} label="Store" onChange={(e) => setStoreId(e.target.value)}>
                    <MenuItem value="">All Stores</MenuItem>
                    {storesRef?.data?.stores?.map((s: any) => (
                      <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {activeTab === 0 && (
            <>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  size="small"
                  type="date"
                  label="Start Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={1.5}>
                <TextField
                  size="small"
                  type="date"
                  label="End Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Grid>
            </>
          )}

          {/* Action Export Buttons */}
          <Grid item xs={12} sm={activeTab === 0 ? 12 : activeTab === 1 ? 7 : 9} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button variant="outlined" color="primary" startIcon={<FileSpreadsheet size={16} />} onClick={exportExcel}>
              Excel
            </Button>
            <Button variant="outlined" color="primary" startIcon={<FileText size={16} />} onClick={exportCSV}>
              CSV
            </Button>
            <Button variant="outlined" color="primary" startIcon={<FileDown size={16} />} onClick={exportPDF}>
              PDF Print
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports Table Grid */}
      <TableContainer component={Paper} sx={{ border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  {getExportData().headers.map((h, i) => (
                    <TableCell key={i} sx={{ fontWeight: 800, color: '#475569' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={getExportData().headers.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No report records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  getExportData().rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any[], rowIndex: number) => (
                    <TableRow key={rowIndex} hover>
                      {row.map((cell: any, cellIndex: number) => (
                        <TableCell key={cellIndex} sx={{ fontWeight: cellIndex === 0 ? 600 : 500 }}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>
    </Container>
  );
};
