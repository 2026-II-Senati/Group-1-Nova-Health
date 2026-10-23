const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'El email y la contraseña son requeridos' });
  }

  try {
    const usuarioSimulado = {
      id: 1,
      nombre: "Cristhian",
      rol_id: 2
    };

    const token = jwt.sign(
      { id: usuarioSimulado.id, email, rol_id: usuarioSimulado.rol_id },
      process.env.JWT_SECRET || 'secreto_nova_salud_2026',
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      token,
      usuario: usuarioSimulado
    });

  } catch (error) {
    console.error('Error en POST /api/auth/login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  login
};