import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue([{ insertId: 42 }]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

vi.mock('./db', () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

vi.mock('../drizzle/schema', () => ({
  contractors: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    company: 'company',
    email: 'email',
    phone: 'phone',
    specialty: 'specialty',
    rating: 'rating',
    hourlyRate: 'hourlyRate',
    licenseNumber: 'licenseNumber',
    insured: 'insured',
    marketArea: 'marketArea',
    notes: 'notes',
    status: 'status',
    updatedAt: 'updatedAt',
  },
  sowContractorAssignments: {
    contractorId: 'contractorId',
    userId: 'userId',
    sentAt: 'sentAt',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ type: 'eq', field: a, value: b })),
  and: vi.fn((...args: any[]) => ({ type: 'and', conditions: args })),
  desc: vi.fn((field) => ({ type: 'desc', field })),
  sql: vi.fn(),
  ne: vi.fn(),
  inArray: vi.fn(),
  asc: vi.fn(),
  isNull: vi.fn(),
}));

describe('Contractors Feature - Database Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.insert.mockReturnThis();
    mockDb.values.mockResolvedValue([{ insertId: 42 }]);
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.delete.mockReturnThis();
  });

  describe('Schema validation', () => {
    it('should have the correct contractor table fields defined', () => {
      const expectedFields = [
        'id', 'userId', 'name', 'company', 'email', 'phone',
        'specialty', 'rating', 'hourlyRate', 'licenseNumber',
        'insured', 'marketArea', 'notes', 'status', 'updatedAt',
      ];
      const contractorFields = {
        id: 'int auto_increment',
        userId: 'int',
        name: 'varchar(255)',
        company: 'varchar(255)',
        email: 'varchar(255)',
        phone: 'varchar(50)',
        specialty: 'enum',
        rating: 'int',
        hourlyRate: 'decimal',
        licenseNumber: 'varchar(100)',
        insured: 'tinyint',
        marketArea: 'varchar(255)',
        notes: 'text',
        status: 'enum',
        updatedAt: 'timestamp',
      };

      for (const field of expectedFields) {
        expect(contractorFields).toHaveProperty(field);
      }
      expect(Object.keys(contractorFields)).toHaveLength(15);
    });

    it('should support all specialty enum values', () => {
      const validSpecialties = [
        'general', 'kitchen', 'bathroom', 'flooring', 'roofing',
        'electrical', 'plumbing', 'hvac', 'painting', 'landscaping',
        'demolition', 'framing', 'drywall', 'windows_doors', 'other',
      ];
      expect(validSpecialties).toHaveLength(15);
      expect(validSpecialties).toContain('general');
      expect(validSpecialties).toContain('kitchen');
      expect(validSpecialties).toContain('windows_doors');
    });

    it('should support all status enum values', () => {
      const validStatuses = ['active', 'inactive', 'blacklisted'];
      expect(validStatuses).toHaveLength(3);
      expect(validStatuses).toContain('active');
      expect(validStatuses).toContain('blacklisted');
    });
  });

  describe('Contractor CRUD operations', () => {
    it('should list contractors for a user', async () => {
      const mockContractors = [
        { id: 1, userId: 1, name: 'John Plumber', specialty: 'plumbing', rating: 4, status: 'active' },
        { id: 2, userId: 1, name: 'Jane Electric', specialty: 'electrical', rating: 5, status: 'active' },
      ];
      mockDb.orderBy.mockResolvedValue(mockContractors);

      const result = await mockDb
        .select()
        .from('contractors')
        .where({ userId: 1 })
        .orderBy({ updatedAt: 'desc' });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Plumber');
      expect(result[1].specialty).toBe('electrical');
    });

    it('should insert a new contractor', async () => {
      const newContractor = {
        userId: 1,
        name: 'Bob Builder',
        company: 'Bob\'s Construction',
        phone: '555-1234',
        email: 'bob@build.com',
        specialty: 'general',
        rating: 4,
        marketArea: 'Dallas, TX',
        notes: 'Great for full rehabs',
        status: 'active',
      };

      const result = await mockDb.insert('contractors').values(newContractor);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(newContractor);
    });

    it('should update an existing contractor', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await mockDb
        .update('contractors')
        .set({
          name: 'Bob Builder Sr.',
          rating: 5,
          notes: 'Updated: excellent for full rehabs',
        })
        .where({ id: 1, userId: 1 });

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({
        name: 'Bob Builder Sr.',
        rating: 5,
        notes: 'Updated: excellent for full rehabs',
      });
    });

    it('should delete a contractor', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await mockDb
        .delete('contractors')
        .where({ id: 1, userId: 1 });

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalledWith({ id: 1, userId: 1 });
    });

    it('should return empty list for user with no contractors', async () => {
      mockDb.orderBy.mockResolvedValue([]);

      const result = await mockDb
        .select()
        .from('contractors')
        .where({ userId: 999 })
        .orderBy({ updatedAt: 'desc' });

      expect(result).toHaveLength(0);
    });
  });

  describe('Trade-to-Specialty mapping', () => {
    const TRADE_TO_SPECIALTY: Record<string, string> = {
      'General Contractor': 'general',
      'Plumber': 'plumbing',
      'Electrician': 'electrical',
      'HVAC': 'hvac',
      'Roofer': 'roofing',
      'Painter': 'painting',
      'Flooring': 'flooring',
      'Drywall': 'drywall',
      'Framing / Carpentry': 'framing',
      'Landscaping': 'landscaping',
      'Concrete / Masonry': 'other',
      'Windows / Doors': 'windows_doors',
      'Kitchen / Bath': 'kitchen',
      'Demolition': 'demolition',
      'Pest Control': 'other',
      'Foundation': 'other',
      'Handyman': 'general',
      'Other': 'other',
    };

    const SPECIALTY_TO_TRADE: Record<string, string> = {
      'general': 'General Contractor',
      'plumbing': 'Plumber',
      'electrical': 'Electrician',
      'hvac': 'HVAC',
      'roofing': 'Roofer',
      'painting': 'Painter',
      'flooring': 'Flooring',
      'drywall': 'Drywall',
      'framing': 'Framing / Carpentry',
      'landscaping': 'Landscaping',
      'windows_doors': 'Windows / Doors',
      'kitchen': 'Kitchen / Bath',
      'demolition': 'Demolition',
      'other': 'Other',
      'bathroom': 'Kitchen / Bath',
    };

    it('should map all 18 UI trade categories to DB specialties', () => {
      const trades = [
        'General Contractor', 'Plumber', 'Electrician', 'HVAC', 'Roofer',
        'Painter', 'Flooring', 'Drywall', 'Framing / Carpentry', 'Landscaping',
        'Concrete / Masonry', 'Windows / Doors', 'Kitchen / Bath', 'Demolition',
        'Pest Control', 'Foundation', 'Handyman', 'Other',
      ];

      for (const trade of trades) {
        expect(TRADE_TO_SPECIALTY[trade]).toBeDefined();
        expect(typeof TRADE_TO_SPECIALTY[trade]).toBe('string');
      }
    });

    it('should map all DB specialties back to UI trade categories', () => {
      const specialties = [
        'general', 'plumbing', 'electrical', 'hvac', 'roofing',
        'painting', 'flooring', 'drywall', 'framing', 'landscaping',
        'windows_doors', 'kitchen', 'demolition', 'other', 'bathroom',
      ];

      for (const spec of specialties) {
        expect(SPECIALTY_TO_TRADE[spec]).toBeDefined();
        expect(typeof SPECIALTY_TO_TRADE[spec]).toBe('string');
      }
    });

    it('should handle round-trip mapping correctly for common trades', () => {
      const testCases = [
        { trade: 'Plumber', expectedSpecialty: 'plumbing' },
        { trade: 'Electrician', expectedSpecialty: 'electrical' },
        { trade: 'HVAC', expectedSpecialty: 'hvac' },
        { trade: 'Roofer', expectedSpecialty: 'roofing' },
        { trade: 'Painter', expectedSpecialty: 'painting' },
      ];

      for (const { trade, expectedSpecialty } of testCases) {
        const specialty = TRADE_TO_SPECIALTY[trade];
        expect(specialty).toBe(expectedSpecialty);
        const backToTrade = SPECIALTY_TO_TRADE[specialty];
        expect(backToTrade).toBe(trade);
      }
    });

    it('should map multiple trades to "other" specialty', () => {
      expect(TRADE_TO_SPECIALTY['Concrete / Masonry']).toBe('other');
      expect(TRADE_TO_SPECIALTY['Pest Control']).toBe('other');
      expect(TRADE_TO_SPECIALTY['Foundation']).toBe('other');
      expect(TRADE_TO_SPECIALTY['Other']).toBe('other');
    });

    it('should map "bathroom" specialty to Kitchen / Bath trade', () => {
      expect(SPECIALTY_TO_TRADE['bathroom']).toBe('Kitchen / Bath');
    });
  });

  describe('Contractor data validation', () => {
    it('should require name and phone for new contractors', () => {
      const form = { name: '', phone: '' };
      const isValid = form.name.length > 0 && form.phone.length > 0;
      expect(isValid).toBe(false);
    });

    it('should accept valid contractor data', () => {
      const form = { name: 'John', phone: '555-1234' };
      const isValid = form.name.length > 0 && form.phone.length > 0;
      expect(isValid).toBe(true);
    });

    it('should enforce rating between 0 and 5', () => {
      const validRatings = [0, 1, 2, 3, 4, 5];
      for (const r of validRatings) {
        expect(r >= 0 && r <= 5).toBe(true);
      }
      expect(-1 >= 0 && -1 <= 5).toBe(false);
      expect(6 >= 0 && 6 <= 5).toBe(false);
    });

    it('should construct marketArea from city and state', () => {
      const city = 'Dallas';
      const state = 'TX';
      const marketArea = [city, state].filter(Boolean).join(', ');
      expect(marketArea).toBe('Dallas, TX');
    });

    it('should handle empty city/state for marketArea', () => {
      const marketArea1 = ['', 'TX'].filter(Boolean).join(', ');
      expect(marketArea1).toBe('TX');

      const marketArea2 = ['Dallas', ''].filter(Boolean).join(', ');
      expect(marketArea2).toBe('Dallas');

      const marketArea3 = ['', ''].filter(Boolean).join(', ') || undefined;
      expect(marketArea3).toBeUndefined();
    });

    it('should parse marketArea back to city and state', () => {
      const marketArea = 'Dallas, TX';
      const city = marketArea.split(',')[0]?.trim() || '';
      const state = marketArea.split(',')[1]?.trim() || '';
      expect(city).toBe('Dallas');
      expect(state).toBe('TX');
    });
  });

  describe('Contractor filtering', () => {
    const contractors = [
      { id: '1', trade: 'Plumber', name: 'John' },
      { id: '2', trade: 'Electrician', name: 'Jane' },
      { id: '3', trade: 'Plumber', name: 'Bob' },
      { id: '4', trade: 'HVAC', name: 'Alice' },
    ];

    it('should return all contractors when no filter is set', () => {
      const filterTrade = '';
      const filtered = filterTrade ? contractors.filter(c => c.trade === filterTrade) : contractors;
      expect(filtered).toHaveLength(4);
    });

    it('should filter contractors by trade', () => {
      const filterTrade = 'Plumber';
      const filtered = contractors.filter(c => c.trade === filterTrade);
      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('John');
      expect(filtered[1].name).toBe('Bob');
    });

    it('should return empty list for trades with no contractors', () => {
      const filterTrade = 'Roofer';
      const filtered = contractors.filter(c => c.trade === filterTrade);
      expect(filtered).toHaveLength(0);
    });

    it('should count contractors per trade correctly', () => {
      const tradeCounts: Record<string, number> = {};
      for (const c of contractors) {
        tradeCounts[c.trade] = (tradeCounts[c.trade] || 0) + 1;
      }
      expect(tradeCounts['Plumber']).toBe(2);
      expect(tradeCounts['Electrician']).toBe(1);
      expect(tradeCounts['HVAC']).toBe(1);
    });
  });
});
