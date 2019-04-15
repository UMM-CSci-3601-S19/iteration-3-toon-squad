import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {User} from "./user";
import {Ride} from "../rides/ride";
import {UserService} from "./user.service";

describe ('User Service: ',() =>{
  const testUsers: User[] = [
    {
      _id: "5cb4fc0e61617348950e29db",
      userId: "342389477594424000000",
      email: "Dreamia5@gmail.com",
      fullName: "Suzette Rutledge",
      pictureUrl: "https://picsum.photos/200/300/?random",
      lastName: "Rutledge",
      firstName: "Suzette",
    },
    {
      _id:"5cb4fc0e61617348950e29d8",
    userId:"655477182929676100000",
    email:"bananacat123@hotmail.com",
    fullName: "Bindi Jenson",
    pictureUrl:"https://bit.ly/2IyHf4I",
    lastName: "Jenson",
    firstName: "Bindi",
    }
  ];

 /* const testRides: Ride[] = [
    {
      _id: '5c832bec26656a20be5ec19a',
      user: "Bindi Jenson",
      userId: "655477182929676100000",
      notes: "Eiusmod laboris commodo sint cupidatat pariatur proident qui dolor cillum sit adipisicing veniam. Cupidatat mollit et anim ut labore tempor quis.",
      seatsAvailable: 4,
      origin: "2046 Neptune Court, Wright, IA 64892",
      destination: "9782 Henry Street, Hannasville, IA 20609",
      departureDate: "2019-05-11T05:00:00.000Z",
      departureTime: "16:21",
      isDriving: true,
      roundTrip: true,
      nonSmoking: false
    },
    {
      _id: '5c832bec201270bd881ace79',
      user: "Suzette Rutledge",
      userId: "342389477594424000000",
      notes: "Occaecat reprehenderit do exercitation laborum. Dolore culpa ut veniam ipsum fugiat voluptate excepteur labore laborum ad Lorem sint aute.",
      seatsAvailable: 1,
      origin: "8631 Hudson Avenue, Crayne, IA 98438",
      destination: "1660 Judge Street, Winston, SD 44478",
      departureDate: "2019-05-11T05:00:00.000Z",
      departureTime: "16:19",
      isDriving: true,
      roundTrip: false,
      nonSmoking: true

    },*/
  ];



  let userService: UserService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    userService = new UserService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('getUserById(userId: string) calls api/user/:id', () => {

    userService.getUserById("655477182929676100000").subscribe(
      user => expect(user).toBe(testUsers[1])
    );

    const req = httpTestingController.expectOne(userService.baseUrl + '/655477182929676100000');
    expect(req.request.method).toEqual('GET');
    req.flush(testUsers);
  });


  /*it('getMyRides(userId: string) calls api/MyRides', () => {

     userService.getMyRides("342389477594424000000").subscribe(
       userRides => expect(userRides).toBe(testRides[1])
     );

     const req = httpTestingController.expectOne('http://localhost:4567/api/myRides?userId=342389477594424000000');
     expect(req.request.method).toEqual('GET');
     req.flush(testUsers);
  })*/

});
