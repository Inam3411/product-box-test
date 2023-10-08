const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 
const { User } = require('../models');
const {clearAllTables} = require('../utils/clearDatabase'); // Adjust the path if needed

chai.use(chaiHttp);
const expect = chai.expect;


before(async () => {
  try {
    await clearAllTables(); // Make sure to use await here
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
});

let phone_number='03409439031'
describe('User Module', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const response = await chai.request(app)
        .post('/api/users')
        .send({ 
          name: 'Umar',
          phone_number
        });

      expect(response).to.have.status(201);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.have.property('id');

      const user = await User.findByPk(response.body.data.id);
      expect(user).to.not.be.null;
      expect(user.name).to.equal('Umar');
      expect(user.phone_number).to.equal(phone_number);
    });
  });

  describe('Unique constraint', () => {
    it('should send a unique constraint error response', async () => {
      
      const response = await chai.request(app)
        .post('/api/users')
        .send({ 
          name: 'Umar',
          phone_number
        });

      expect(response).to.have.status(409);
    });
  });


  describe('generateOTP', () => {
    it('should generate an OTP and set expiration date', async () => {
      const response = await chai.request(app)
        .post('/api/users/generateOTP')
        .send({ phone_number });

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('user_id');

      const user = await User.findByPk(response.body.user_id);
      expect(user).to.not.be.null;
      expect(user.otp_expiration_date).to.be.a('Date');
    });
  });
  describe('verifyOTP', () => {

    it('should return error if OTP is incorrect', async () => {
      
      const user = new User({name:'Test User', phone_number: 12345678})
      user.otp = await user.createAndGetOTP()
      await user.save()

      const response = await chai.request(app)
        .get(`/api/users/${user.id}/verifyOTP?otp=127`);

      expect(response).to.have.status(400);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('message').to.equal('Incorrect OTP');
    });

    it('should return user object if OTP is correct and not expired', async () => {

      const user = new User({name:'Test User', phone_number: 439245})
      const otp = await user.createAndGetOTP()
      await user.save()

      const response = await chai.request(app)
        .get(`/api/users/${user.id}/verifyOTP?otp=${otp}`);

      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.have.property('id').to.equal(user.id);
    });
  });
});

after(()=>{
  process.exit(0)
})