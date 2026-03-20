import * as programService from '../service/programService.js';

export const createProgram = async (req, res) => {
  try {
    // Data di req.body sudah divalidasi dan disanitasi oleh Joi
    const newProgram = await programService.createProgramService(req.body);

    res.status(201).json({
      success: true,
      message: 'Program berhasil ditambahkan',
      data: newProgram
    });
  } catch (error) {
    console.error('Controller Error Create Program:', error);
    res.status(500).json({ error: 'Gagal menambah program', details: error.message });
  }
};

export const getAllPrograms = async (req, res) => {
  try {
    const programs = await programService.getAllProgramsService();
    
    res.json({
      success: true,
      data: programs
    });
  } catch (error) {
    console.error('Controller Error Get Programs:', error);
    res.status(500).json({ error: 'Gagal mengambil data program' });
  }
};