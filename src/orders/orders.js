import pool from "../config.js";

export const admin_orders = async (req, res) => {
  try {
    const { query, limit, offset, from_date } = req.body;
    const { rows } = await pool.query(
      ` SELECT o.* , u.name , u.email FROM public.orders o join users u  on ordered_by_uid = u.uid
      where name like concat('%',cast($1 as text),'%')  
       and (cast($4 as date) is null or o.created_at >= cast($4 as date)) and email like concat('%',cast($1 as text),'%') 
        limit ($2) offset ($3)
       
       `,
      [query, limit, offset, from_date]
    );
    res.send(rows);
  } catch (e) {
    console.log(e);
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
  const client = await pool.connect();
  try {
    const {
      is_donated,
      address_id,
      ordered_by_uid,
      status,
      products,
      user_id,
    } = req.body;

    if (!products) {
      return res
        .status(400)
        .json({ message: "Please select some products first." });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO public.orders(created_at, is_donated, address_id, ordered_by_uid, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [new Date(), is_donated, address_id, ordered_by_uid, status]
    );

    const orderId = orderResult.rows[0].id;

    if (!orderId) {
      throw new Error("Failed to create order.");
    }

    await Promise.all(
      products.map(async (product) => {
        const campaign_id = product.campaign_id;
        await client.query(
          `INSERT INTO public.orders_products(order_id, product_id, qty, status)
             VALUES ($1, $2, $3, 1);`,
          [orderId, product?.id, product.qty]
        );

        await client.query(
          `INSERT INTO public.tickets(campaign_id, created_at, is_winner, user_id, order_id, product_id)
             VALUES ($1, current_timestamp, false, $2, $3, $4);`,
          [campaign_id, user_id, orderId, product?.id]
        );
        await client.query(
          `UPDATE public.products SET remaining_qty = remaining_qty - $1 WHERE id = $2;`,
          [product.qty, product?.id]
        );
        await client.query(
          `UPDATE public.campaigns SET remaining_qty = remaining_qty - $1 WHERE id = $2;`,
          [product.qty, campaign_id]
        );
      })
    );

    await client.query("COMMIT"); // Commit transaction

    res.status(200).json({ message: "Order created successfully.", orderId });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction
    console.error("Error making order:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  } finally {
    client.release(); // Release the client back to the pool
  }
};
