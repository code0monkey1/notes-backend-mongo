import supertest from 'supertest';
import app from '../../src/app';

describe('User', () => { 

    const BASE_URL = "/auth/register";
    const api = supertest(app);
     
     describe('/register', () => { 
          
          it('shoud return response code 200', async () => { 
                 
                await api
                .post(BASE_URL)
                .send({})
                .expect(200);

          })

          it('should have the supplied body in request' , async()=>{

            const body={
                    name:'user-name',
                    username:"username",
                    email:"email@gmail.com",
                    password:"12345"
                    
                }

             const response = await api
            .post(BASE_URL)
            .send(body)
            .expect(200);
    
           expect(response.body).toEqual(body)
        })

        it('should throw error for body with missing email field', async () => {
              
            const body={
                name:'user-name',
                username:"username",
                email:"email@gmail.com",
                password:"12345"
                
            }

            const response = await api
            .post(BASE_URL)
            .send(body)
            .expect(200);

            expect(response.body).toEqual(body)

               
             
        })

    })

})