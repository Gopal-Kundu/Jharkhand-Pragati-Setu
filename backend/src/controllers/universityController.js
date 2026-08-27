import University from '../models/University.js';
import { MASTER_HEI_CATALOG } from '../data/masterCatalog.js';

/**
 * @desc    Get all registered Universities & HEI institutions
 * @route   GET /api/universities
 * @access  Public
 */
export const getUniversities = async (req, res) => {
  try {
    const { discipline, district } = req.query;
    const filter = {};

    if (discipline && discipline !== 'all') {
      filter.academicDisciplines = new RegExp(discipline, 'i');
    }
    if (district && district !== 'all') {
      filter['location.district'] = new RegExp(district, 'i');
    }

    let universities = await University.find(filter).sort({ nirfRank: 1, name: 1 });

    if (!universities || universities.length === 0) {
      universities = MASTER_HEI_CATALOG;
    }

    return res.status(200).json({
      success: true,
      count: universities.length,
      universities
    });
  } catch (error) {
    console.error('[Get Universities Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching universities'
    });
  }
};

/**
 * @desc    Get single University details with research labs & faculty leads
 * @route   GET /api/universities/:id
 * @access  Public
 */
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    const university = await University.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { institutionId: id }]
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: `University '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      university
    });
  } catch (error) {
    console.error('[Get University By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching university profile'
    });
  }
};

export default {
  getUniversities,
  getUniversityById
};
