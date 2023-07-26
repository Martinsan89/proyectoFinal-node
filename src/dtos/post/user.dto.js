import { z } from "zod";

export const UserDto = z.object({
  first_name: z
    .string()
    .min(3, "INGRESE SU NOMBRE, MINIMO 3 CARACTERES")
    .max(100),
  last_name: z
    .string()
    .min(3, "INGRESE SU APELLIDO, MINIMO 3 CARACTERES")
    .max(100),
  phone: z.string().nonempty("INGRESE UN TELEFONO"),
  age: z.string().nonempty("INGRESE SU EDAD"),
  email: z.string().email("INGRESE UN EMAIL VÁLIDO"),
  password: z
    .string()
    .min(4, "PASSWORD MINIMO 4 CARACTERES")
    .nonempty("INGRESE UNA CONTRASEÑA VÁLIDA"),
});
