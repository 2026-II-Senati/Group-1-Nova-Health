const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son requeridos' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol_id: usuario.rol_id
      },
      process.env.JWT_SECRET || 'secreto_nova_salud_2026',
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol_id: usuario.rol_id
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };
