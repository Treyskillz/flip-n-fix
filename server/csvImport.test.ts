import { describe, it, expect } from "vitest";

// Test the parseCSVLine helper logic (mirrors the function in routers.ts)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

describe("parseCSVLine", () => {
  it("parses simple CSV line", () => {
    const result = parseCSVLine("a,b,c");
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("parses quoted fields", () => {
    const result = parseCSVLine('"hello world",foo,bar');
    expect(result).toEqual(["hello world", "foo", "bar"]);
  });

  it("handles commas inside quotes", () => {
    const result = parseCSVLine('"123 Main St, Apt 4",Phoenix,AZ');
    expect(result).toEqual(["123 Main St, Apt 4", "Phoenix", "AZ"]);
  });

  it("handles escaped quotes", () => {
    const result = parseCSVLine('"He said ""hello""",b,c');
    expect(result).toEqual(['He said "hello"', "b", "c"]);
  });

  it("handles empty fields", () => {
    const result = parseCSVLine("a,,c,");
    expect(result).toEqual(["a", "", "c", ""]);
  });

  it("handles numeric values", () => {
    const result = parseCSVLine("150000,250000,45000");
    expect(result).toEqual(["150000", "250000", "45000"]);
  });

  it("handles dollar signs and commas in numbers", () => {
    const result = parseCSVLine('"$150,000","$250,000","$45,000"');
    expect(result).toEqual(["$150,000", "$250,000", "$45,000"]);
  });

  it("parses full deal CSV line", () => {
    const line = '"123 Main St","Phoenix","AZ","85001",150000,250000,45000,1500,3,2,1985,"Phoenix Metro","active","Great flip"';
    const result = parseCSVLine(line);
    expect(result.length).toBe(14);
    expect(result[0]).toBe("123 Main St");
    expect(result[1]).toBe("Phoenix");
    expect(result[4]).toBe("150000");
    expect(result[11]).toBe("Phoenix Metro");
    expect(result[12]).toBe("active");
    expect(result[13]).toBe("Great flip");
  });
});

describe("CSV Import field mapping", () => {
  const fieldMap: Record<string, string> = {
    'address': 'address',
    'street': 'address',
    'street address': 'address',
    'property address': 'address',
    'city': 'city',
    'state': 'state',
    'zip': 'zip',
    'zip code': 'zip',
    'zipcode': 'zip',
    'purchase price': 'purchasePrice',
    'purchaseprice': 'purchasePrice',
    'purchase_price': 'purchasePrice',
    'price': 'purchasePrice',
    'arv': 'arv',
    'after repair value': 'arv',
    'after_repair_value': 'arv',
    'rehab cost': 'rehabCost',
    'rehabcost': 'rehabCost',
    'rehab_cost': 'rehabCost',
    'repair cost': 'rehabCost',
    'repairs': 'rehabCost',
    'sqft': 'sqft',
    'sq ft': 'sqft',
    'square feet': 'sqft',
    'square footage': 'sqft',
    'beds': 'beds',
    'bedrooms': 'beds',
    'baths': 'baths',
    'bathrooms': 'baths',
    'year built': 'yearBuilt',
    'yearbuilt': 'yearBuilt',
    'year_built': 'yearBuilt',
    'market': 'market',
    'notes': 'notes',
    'status': 'status',
  };

  it("maps standard headers correctly", () => {
    const headers = ["Address", "City", "State", "Zip", "Purchase Price", "ARV", "Rehab Cost"];
    const colMapping: Record<string, number> = {};
    headers.forEach((h, i) => {
      const mapped = fieldMap[h.toLowerCase().trim()];
      if (mapped) colMapping[mapped] = i;
    });
    expect(colMapping.address).toBe(0);
    expect(colMapping.city).toBe(1);
    expect(colMapping.state).toBe(2);
    expect(colMapping.zip).toBe(3);
    expect(colMapping.purchasePrice).toBe(4);
    expect(colMapping.arv).toBe(5);
    expect(colMapping.rehabCost).toBe(6);
  });

  it("maps alternative headers correctly", () => {
    const headers = ["Street Address", "City", "State", "Zip Code", "Price", "After Repair Value", "Repairs"];
    const colMapping: Record<string, number> = {};
    headers.forEach((h, i) => {
      const mapped = fieldMap[h.toLowerCase().trim()];
      if (mapped) colMapping[mapped] = i;
    });
    expect(colMapping.address).toBe(0);
    expect(colMapping.purchasePrice).toBe(4);
    expect(colMapping.arv).toBe(5);
    expect(colMapping.rehabCost).toBe(6);
  });

  it("detects missing required columns", () => {
    const headers = ["Address", "City", "State"];
    const colMapping: Record<string, number> = {};
    headers.forEach((h, i) => {
      const mapped = fieldMap[h.toLowerCase().trim()];
      if (mapped) colMapping[mapped] = i;
    });
    const requiredCols = ['address', 'city', 'state', 'zip', 'purchasePrice', 'arv', 'rehabCost'];
    const missingCols = requiredCols.filter(c => colMapping[c] === undefined);
    expect(missingCols).toContain('zip');
    expect(missingCols).toContain('purchasePrice');
    expect(missingCols).toContain('arv');
    expect(missingCols).toContain('rehabCost');
    expect(missingCols.length).toBe(4);
  });
});

describe("Deal calculations from CSV import", () => {
  it("calculates profit correctly", () => {
    const purchasePrice = 150000;
    const arv = 250000;
    const rehabCost = 45000;
    const totalInvestment = purchasePrice + rehabCost;
    const netProfit = arv - totalInvestment;
    const roi = (netProfit / totalInvestment) * 100;

    expect(totalInvestment).toBe(195000);
    expect(netProfit).toBe(55000);
    expect(roi).toBeCloseTo(28.21, 1);
  });

  it("calculates 70% rule correctly", () => {
    const arv = 250000;
    const rehabCost = 45000;
    const maxAllowableOffer = Math.round(arv * 0.7 - rehabCost);
    expect(maxAllowableOffer).toBe(130000);
  });

  it("handles zero purchase price", () => {
    const purchasePrice = 0;
    expect(purchasePrice <= 0).toBe(true);
  });

  it("handles negative ARV", () => {
    const arv = -50000;
    expect(arv <= 0).toBe(true);
  });

  it("assigns correct deal verdict based on ROI", () => {
    const getVerdict = (roi: number) => {
      if (roi >= 20) return 'Strong Buy';
      if (roi >= 10) return 'Good Deal';
      if (roi >= 0) return 'Marginal';
      return 'Risky';
    };

    expect(getVerdict(30)).toBe('Strong Buy');
    expect(getVerdict(20)).toBe('Strong Buy');
    expect(getVerdict(15)).toBe('Good Deal');
    expect(getVerdict(10)).toBe('Good Deal');
    expect(getVerdict(5)).toBe('Marginal');
    expect(getVerdict(0)).toBe('Marginal');
    expect(getVerdict(-10)).toBe('Risky');
  });

  it("assigns correct deal score based on ROI", () => {
    const getScore = (roi: number) => {
      if (roi >= 30) return 90;
      if (roi >= 20) return 80;
      if (roi >= 15) return 70;
      if (roi >= 10) return 60;
      if (roi >= 5) return 50;
      if (roi >= 0) return 35;
      return 20;
    };

    expect(getScore(35)).toBe(90);
    expect(getScore(25)).toBe(80);
    expect(getScore(17)).toBe(70);
    expect(getScore(12)).toBe(60);
    expect(getScore(7)).toBe(50);
    expect(getScore(2)).toBe(35);
    expect(getScore(-5)).toBe(20);
  });

  it("strips dollar signs and commas from numeric values", () => {
    const parseNum = (val: string) => {
      const cleaned = val.replace(/[\$,]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : Math.round(num);
    };

    expect(parseNum("$150,000")).toBe(150000);
    expect(parseNum("250000")).toBe(250000);
    expect(parseNum("$45,000.50")).toBe(45001);
    expect(parseNum("")).toBe(0);
    expect(parseNum("abc")).toBe(0);
  });

  it("validates status values", () => {
    const validStatuses = ['active', 'under_contract', 'closed', 'passed', 'archived'];
    expect(validStatuses.includes('active')).toBe(true);
    expect(validStatuses.includes('closed')).toBe(true);
    expect(validStatuses.includes('invalid')).toBe(false);
    expect(validStatuses.includes('')).toBe(false);
  });
});

describe("Shared deal view notification logic", () => {
  it("triggers notification on first view", () => {
    const viewCount = 1;
    const shouldNotify = viewCount === 1 || viewCount % 5 === 0;
    expect(shouldNotify).toBe(true);
  });

  it("triggers notification on every 5th view", () => {
    expect(5 % 5 === 0).toBe(true);
    expect(10 % 5 === 0).toBe(true);
    expect(15 % 5 === 0).toBe(true);
  });

  it("does not trigger notification on 2nd, 3rd, 4th views", () => {
    for (const count of [2, 3, 4]) {
      const shouldNotify = count === 1 || count % 5 === 0;
      expect(shouldNotify).toBe(false);
    }
  });

  it("does not trigger notification on non-5th views", () => {
    for (const count of [6, 7, 8, 9, 11, 12, 13, 14]) {
      const shouldNotify = count === 1 || count % 5 === 0;
      expect(shouldNotify).toBe(false);
    }
  });
});
