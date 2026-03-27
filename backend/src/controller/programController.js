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
export const getProgramTransactions = async (req, res) => {
  const { id } = req.params; // Mengambil program_id dari URL
  try {
    const transactions = await programService.getTransactionsByProgramService(id);
    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data transaksi" });
  }
};

export const updateProgram = async (req, res) => {
  const { id } = req.params;
  try {
    // Memanggil service, bukan langsung pool query
    const updatedProgram = await programService.updateProgramService(id, req.body);

    if (!updatedProgram) {
      return res.status(404).json({ 
        success: false, 
        message: 'Program tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'Program berhasil diperbarui',
      data: updatedProgram
    });
  } catch (error) {
    console.error('Controller Error Update Program:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal memperbarui program', 
      details: error.message 
    });
  }
};