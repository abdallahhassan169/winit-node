import pool from "../config.js";

export const get_statistics = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `select
(select count(id) from public.users u  where u.user_type = 1) as users,
(select count(id) from public.users u  where u.user_type = 2) as admins,
(select count(id) from public.orders c  where c.status =1) as new_orders,
(select count(id) from public.orders c  where c.status=2) as under_process_orders,
(select count(id) from public.orders c  where c.status =3) as cancelled_orders,
(select count(id) from public."campaigns"  c  where target > 0) as active_campigns,
(select count(id) from public."campaigns" c  where target <= 0) as finished_campigns,
(select count(id) from public."products" c   ) as products `
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
    res.send({ "error ": e });
  }
};
