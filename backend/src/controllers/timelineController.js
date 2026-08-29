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
  let finalColour = colour || 'green';

  if (typeof titleOrData === 'object' && titleOrData !== null) {
    finalTitle = titleOrData.title || titleOrData.action || 'Milestone Update';
    finalDescription = titleOrData.description || titleOrData.note || '';
    finalColour = titleOrData.colour || titleOrData.color || 'green';
  } else if (!description && typeof titleOrData === 'string') {
    finalDescription = titleOrData;
    finalTitle = 'Milestone Update';
  }

  const timelineEntry = {
    title: finalTitle || 'Milestone Update',
    description: finalDescription || '',
    colour: finalColour || 'green',
    createdAt: new Date()
  };

  const updated = await Problem.findByIdAndUpdate(
    problemId,
    {
      $push: {
        timeline: timelineEntry
      }
    },
    { new: true }
  );

  return updated;
};

/**
 * @desc    Add a milestone event to a problem's timeline via API
 * @route   POST /api/problems/:problemId/timeline
 * @access  Private
 */
export const addTimelineEvent = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { title, description, colour = 'green' } = req.body;

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

    const updatedProblem = await pushProblemTimeline(problemId, title, description, colour);

    return res.status(201).json({
      success: true,
      message: 'Timeline event successfully added',
      timeline: updatedProblem.timeline
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
