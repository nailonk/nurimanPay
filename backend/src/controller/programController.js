import * as programService from '../service/programService.js';

export const createProgram = async (req, res) => {
  try {
    const { title, target_amount } = req.body;

    // Validasi sederhana sebelum masuk ke service
    if (!title || !target_amount) {
      return res.status(400).json({ error: 'Judul dan Target Nominal harus diisi' });
    }

    const newProgram = await programService.createProgramService(req.body);

    res.status(201).json({
      success: true,
      message: 'Program berhasil ditambahkan',
      data: newProgram
    });
  } catch (error) {
    console.error('Controller Error Create Program:', error);
    res.status(500).json({ error: 'Gagal menambah program' });
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