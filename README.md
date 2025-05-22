## MARKET CLOTHES

### Database Diagram

The following diagram illustrates the database structure used in this project.  
You can view the full diagram [here](https://github.com/ren-zi-fa/market-cloths/blob/main/diagram/database.puml):

![Database Diagram](https://github.com/ren-zi-fa/market-cloths/blob/main/out/diagram/database/market_clothes.png)

### Features

- Token-based authentication (Auth)
- CRUD operations for Category
- CRUD operations for Product

**_NOTE_**  
ALL THE ROUTES EXCEPT AUTH DO NOT REQUIRE ACCESS TOKEN.  
IF YOU ARE NOT LOGGED IN, YOU CAN STILL USE THEM LOCALLY.  
THIS API IS NOT INTENDED FOR PRODUCTION USE.

---

### CORS Policy

This REST API only allows requests from the following origins:

- `http://localhost:3000`
- `https://market-clozy.vercel.app/`
- `https://market-cloths.vercel.app/`

Make sure your frontend is served from one of these domains to access the API successfully.
