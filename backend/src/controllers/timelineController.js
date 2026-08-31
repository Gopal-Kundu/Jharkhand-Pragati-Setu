import Problem from '../models/Problem.js';

/**
 * Reusable service function to push an entry into a Problem's timeline
 * @param {string|mongoose.Types.ObjectId} problemId - Target Problem ID
 * @param {string|Object} titleOrData - Milestone title OR { title, description, colour }
 * @param {string} [description] - Detailed milestone description
 * @param {string} [colour='green'] - Milestone colour (default: 'green')
 */
export const pushProblemTimeline = async (problemId, titleOrData, description, colour = 'green') => {
  let finalTitle = titleOrData;
  let finalDescription = description;

  if (typeof titleOrData === 'object' && titleOrData !== null) {
    finalTitle = titleOrData.title || titleOrData.action || 'Milestone Update';
    finalDescription = titleOrData.description || titleOrData.note || '';
  } else if (!description && typeof titleOrData === 'string') {
    finalDescription = titleOrData;
    finalTitle = 'Milestone Update';
  }

  const auditEntry = {
    action: finalTitle || 'Milestone Update',
    note: finalDescription || '',
    officer: 'System / Project Lead',
    role: 'university',
    timestamp: new Date()
  };

  const updated = await Problem.findByIdAndUpdate(
    problemId,
    {
      $push: {
        auditHistory: {
          $each: [auditEntry],
          $position: 0
        }
      }
    },
    { new: true }
  );

  return updated;
};

/**
 * @desc    Add a milestone event to a problem's audit history via API
 * @route   POST /api/problems/:problemId/timeline
 * @access  Private
 */
export const addTimelineEvent = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'title and description are required for adding a timeline event'
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem #${problemId} not found`
      });
    }

    const updatedProblem = await pushProblemTimeline(problemId, title, description);

    return res.status(201).json({
      success: true,
      message: 'Timeline event successfully added',
      auditHistory: updatedProblem.auditHistory
    });
  } catch (error) {
    console.error('[Add Timeline Event Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding timeline event'
    });
  }
};

export default {
  pushProblemTimeline,
  addTimelineEvent
};
