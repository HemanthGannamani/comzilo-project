import { reportValidation } from '../../src/validations/report.validation';
import { ReportService } from '../../src/services/report.service';

describe('Unit Tests: Reporting & Analytics Module', () => {
  let reportService: ReportService;

  beforeAll(() => {
    reportService = new ReportService();
  });

  describe('Validation Schemas', () => {
    it('should validate valid sales report query parameters', () => {
      const query = {
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        period: 'monthly',
      };
      const { error } = reportValidation.getSalesReport.validate(query);
      expect(error).toBeUndefined();
    });

    it('should reject invalid report period', () => {
      const query = {
        period: 'hourly',
      };
      const { error } = reportValidation.getSalesReport.validate(query);
      expect(error).toBeDefined();
    });

    it('should validate valid CSV export request', () => {
      const query = {
        reportType: 'sales',
      };
      const { error } = reportValidation.exportCSV.validate(query);
      expect(error).toBeUndefined();
    });
  });

  describe('CSV Generation Logic', () => {
    it('should generate valid RFC-4180 CSV string from tabular rows', () => {
      const data = [
        { periodGroup: '2026-07', grossSales: 500.0, netSales: 450.0 },
        { periodGroup: '2026-08', grossSales: 1000.0, netSales: 900.0 },
      ];
      const csv = reportService.generateCSV(data);
      expect(csv).toContain('periodGroup,grossSales,netSales');
      expect(csv).toContain('"2026-07","500","450"');
      expect(csv).toContain('"2026-08","1000","900"');
    });

    it('should return fallback header for empty row array', () => {
      const csv = reportService.generateCSV([]);
      expect(csv).toBe('No data available\n');
    });
  });
});
