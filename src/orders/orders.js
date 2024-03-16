import pool from "../config.js";

export const admin_orders = async (req, res) => {
  try {
    const { query, limit, offset, from_date } = req.body;
    const { rows } = await pool.query(
      ` SELECT o.* , u.name , u.email FROM public.orders o join users u on on ordered_by_uid = u.uid
      where name like concat('%',cast($1 as text),'%')  
       and (cast($4 as date) is null or start_date > cast($4 as date)) and email like concat('%',cast($1 as text),'%') 
        limit ($2) offset ($3)
       
       `,
      [query, limit, offset, from_date]
    );
    res.send(rows);
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const my_user_orders = async (req, res) => {
  try {
    const { query, limit, offset, from_date, user_id } = req.body;
    const { rows } = await pool.query(
      ` SELECT o.* , u.name , u.email FROM public.orders o join users u on on ordered_by_uid = u.uid
      where  u.uid = ($3) order by created_at desc
        
        limit ($1) offset ($2)
       
       `,
      [limit, offset, user_id]
    );
    res.send(rows);
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

export const make_order = async (req, res) => {
  try {
    const {
      created_at,
      is_donated,
      address_id,
      ordered_by_uid,
      status,
      products,
      campaign_id,
      user_id,
    } = req.body;
    const result = await pool.query(
      `INSERT INTO public.orders(created_at, is_donated, address_id, ordered_by_uid, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [created_at, is_donated, address_id, ordered_by_uid, status]
    );

    const orderId = result.rows[0].id;
    products?.map(async (product) => {
      const add_products_tickets_to_order = await pool.query(
        `INSERT INTO public.orders_products(
	order_id, product_id, qty, status)
	VALUES ($1, $2, $3, 1);
    INSERT INTO public.tickets(
	  campaign_id,   created_at, is_winner, user_id, order_id, product_id)
	VALUES ($4, current_timestamp, false, $5, $1, $2);
    update  public.products set remaining_qty = remaining_qty - $3 where id = $2;
    
    `,
        [orderId, product?.id, product.qty, campaign_id, user_id]
      );
    });

    res.send(rows);
  } catch (e) {
    res.status(400).send({ error: e });
  }
};
