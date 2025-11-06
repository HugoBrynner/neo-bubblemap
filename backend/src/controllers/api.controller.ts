import { Request, Response } from 'express';
import { DataService } from '../services/data.service';
import { FilterOptions } from '../types';

export class ApiController {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  /**
   * GET /api/tokens
   * Get list of available tokens
   */
  async getTokens(req: Request, res: Response) {
    try {
      const tokens = await this.dataService.getTokenList();
      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      console.error('Error in getTokens:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tokens',
      });
    }
  }

  /**
   * GET /api/bubblemap/:token
   * Get bubble map data for a specific token
   */
  async getBubbleMap(req: Request, res: Response) {
    try {
      const { token } = req.params;
      
      // Parse filter options from query parameters
      const options: FilterOptions = {
        minBalance: req.query.minBalance ? parseFloat(req.query.minBalance as string) : undefined,
        maxBalance: req.query.maxBalance ? parseFloat(req.query.maxBalance as string) : undefined,
        cluster: req.query.cluster as string | undefined,
        startTime: req.query.startTime ? parseInt(req.query.startTime as string) : undefined,
        endTime: req.query.endTime ? parseInt(req.query.endTime as string) : undefined,
      };

      const data = await this.dataService.getBubbleMapData(token, options);
      
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error in getBubbleMap:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bubble map data',
      });
    }
  }

  /**
   * GET /api/address/:address
   * Get details for a specific address
   */
  async getAddressDetails(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token parameter is required',
        });
      }

      const data = await this.dataService.getAddressDetails(
        address,
        token as string
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error in getAddressDetails:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch address details',
      });
    }
  }

  /**
   * POST /api/cache/clear
   * Clear the cache
   */
  async clearCache(req: Request, res: Response) {
    try {
      this.dataService.clearCache();
      res.json({
        success: true,
        message: 'Cache cleared successfully',
      });
    } catch (error) {
      console.error('Error in clearCache:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache',
      });
    }
  }

  /**
   * GET /api/health
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response) {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }
}
