import { describe, it, expect } from 'vitest';
import { QuoteEntity, QuoteItemVO } from '../Quote';

const baseItem = {
  label: 'Pose carrelage',
  quantity: 10,
  unit: 'm²' as const,
  unitPrice: { amount: 50, currency: 'EUR' },
  vatRate: 10,
  priceHT: 50,
};

const baseEntityProps = {
  id: crypto.randomUUID(),
  companyId: 'company-1',
  clientName: 'Martin SA',
};

describe('QuoteItemVO', () => {
  it('calcule totalHT correctement', () => {
    const item = new QuoteItemVO(baseItem);
    expect(item.totalHT).toBe(500);
  });

  it('calcule totalTTC avec TVA 10%', () => {
    const item = new QuoteItemVO(baseItem);
    expect(item.totalTTC).toBeCloseTo(550);
  });

  it('sérialise et désérialise via fromJSON', () => {
    const item = QuoteItemVO.fromJSON(baseItem);
    expect(item.label).toBe('Pose carrelage');
    expect(item.unit).toBe('m²');
  });
});

describe('QuoteEntity', () => {
  it('crée une entité avec statut DRAFT par défaut', () => {
    const entity = new QuoteEntity(baseEntityProps);
    expect(entity.status).toBe('DRAFT');
    expect(entity.items).toHaveLength(0);
  });

  it('addItem retourne une nouvelle entité (immutabilité)', () => {
    const entity = new QuoteEntity(baseEntityProps);
    const item = new QuoteItemVO(baseItem);
    const updated = entity.addItem(item);

    expect(updated).not.toBe(entity);
    expect(updated.items).toHaveLength(1);
    expect(entity.items).toHaveLength(0);
  });

  it('recalcule totalHT après ajout d\'un item', () => {
    const entity = new QuoteEntity(baseEntityProps);
    const item = new QuoteItemVO(baseItem);
    const updated = entity.addItem(item);

    expect(updated.totalHT).toBe(500);
    expect(updated.totalTTC).toBeCloseTo(550);
  });

  it('updateStatus retourne une nouvelle entité', () => {
    const entity = new QuoteEntity(baseEntityProps);
    const sent = entity.updateStatus('SENT');

    expect(sent.status).toBe('SENT');
    expect(entity.status).toBe('DRAFT');
  });

  it('fromJSON reconstruit l\'entité correctement', () => {
    const entity = QuoteEntity.fromJSON({
      id: '123e4567-e89b-12d3-a456-426614174000',
      companyId: 'company-1',
      clientName: 'Test Client',
      status: 'DRAFT',
      createdAt: new Date(),
      items: [baseItem],
      totalHT: { amount: 500, currency: 'EUR' },
      totalTTC: { amount: 550, currency: 'EUR' },
    });

    expect(entity.clientName).toBe('Test Client');
    expect(entity.items).toHaveLength(1);
  });
});
