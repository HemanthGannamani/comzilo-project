/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ShippingZone,
  ShippingMethod,
  ShippingCarrier,
  StoreOrderShipment,
  ShipmentTrackingEvent,
  ShipmentPickup,
} from '../database/models';
import { createAuditLog } from '../utils/auditHelper';

export class StoreShippingService {
  // ================= SHIPPING ZONES & METHODS =================
  static async getZones(tenantId: number, storeId: number) {
    const zones = await ShippingZone.findAll({
      where: { tenantId, storeId },
      include: [{ model: ShippingMethod, as: 'methods' }],
      order: [['priority', 'ASC']],
    });
    return zones;
  }

  static async createZone(tenantId: number, storeId: number, userId: number, payload: any) {
    const zone = await ShippingZone.create({
      tenantId,
      storeId,
      name: payload.name,
      countries: payload.countries || [],
      states: payload.states || [],
      postalCodes: payload.postalCodes || [],
      priority: payload.priority || 0,
      status: payload.status || 'active',
    } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'shipping_zone.created',
      entityType: 'ShippingZone',
      entityId: String(zone.id),
    });

    return zone;
  }

  static async createMethod(tenantId: number, storeId: number, userId: number, payload: any) {
    const method = await ShippingMethod.create({
      tenantId,
      storeId,
      zoneId: payload.zoneId,
      name: payload.name,
      code: payload.code || `METHOD-${Date.now()}`,
      type: payload.type || 'standard',
      rate: payload.rate || 0.0,
      estimatedDays: payload.estimatedDays || 3,
      status: payload.status || 'active',
    } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'shipping_method.created',
      entityType: 'ShippingMethod',
      entityId: String(method.id),
    });

    return method;
  }

  // ================= CARRIERS =================
  static async getCarriers(tenantId: number, storeId: number) {
    const carriers = await ShippingCarrier.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return carriers;
  }

  static async createCarrier(tenantId: number, storeId: number, userId: number, payload: any) {
    const carrier = await ShippingCarrier.create({
      tenantId,
      storeId,
      name: payload.name,
      code: payload.code || payload.name.toLowerCase().replace(/\s+/g, '_'),
      trackingUrlTemplate: payload.trackingUrlTemplate || null,
      status: payload.status || 'active',
    } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'carrier.created',
      entityType: 'ShippingCarrier',
      entityId: String(carrier.id),
    });

    return carrier;
  }

  // ================= SHIPMENTS & TRACKING =================
  static async getShipments(tenantId: number, storeId: number, query: any) {
    const page = parseInt(query.page || '0', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = page * limit;

    const where: any = { tenantId, storeId };
    if (query.status) {
      where.status = query.status;
    }

    const { rows, count } = await StoreOrderShipment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return { shipments: rows, total: count, page, limit };
  }

  static async createShipment(tenantId: number, storeId: number, userId: number, payload: any) {
    const shipment = await StoreOrderShipment.create({
      tenantId,
      storeId,
      orderId: payload.orderId,
      carrier: payload.carrier || 'FedEx',
      trackingNumber: payload.trackingNumber || `TRACK-${Date.now()}`,
      trackingUrl: payload.trackingUrl || null,
      shippingCost: payload.shippingCost || 0.0,
      status: 'pending',
      shippedAt: new Date(),
    });

    await ShipmentTrackingEvent.create({
      shipmentId: shipment.id,
      eventType: 'created',
      status: 'pending',
      description: 'Shipment created and queued for packing',
      eventTime: new Date(),
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'shipment.created',
      entityType: 'StoreOrderShipment',
      entityId: String(shipment.id),
    });

    return shipment;
  }

  static async updateShipmentStatus(
    tenantId: number,
    storeId: number,
    userId: number,
    id: number,
    status: string,
    location?: string,
    description?: string
  ) {
    const shipment = await StoreOrderShipment.findOne({ where: { id, tenantId, storeId } });
    if (!shipment) throw new Error('Shipment not found');

    await shipment.update({ status });

    await ShipmentTrackingEvent.create({
      shipmentId: id,
      eventType: status,
      status,
      location: location || null,
      description: description || `Shipment status updated to ${status}`,
      eventTime: new Date(),
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: `shipment.status.${status}`,
      entityType: 'StoreOrderShipment',
      entityId: String(id),
    });

    return shipment;
  }

  // ================= CARRIER PICKUPS =================
  static async schedulePickup(tenantId: number, storeId: number, userId: number, payload: any) {
    const pickupNumber = `PICKUP-${Date.now()}`;
    const pickup = await ShipmentPickup.create({
      tenantId,
      storeId,
      warehouseId: payload.warehouseId || 1,
      carrierId: payload.carrierId || 1,
      pickupNumber,
      pickupDate: payload.pickupDate || new Date().toISOString().split('T')[0],
      pickupTime: payload.pickupTime || '10:00 AM - 02:00 PM',
      status: 'scheduled',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'pickup.scheduled',
      entityType: 'ShipmentPickup',
      entityId: String(pickup.id),
    });

    return pickup;
  }
}
