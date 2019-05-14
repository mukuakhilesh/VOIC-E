#include<bits/stdc++.h>
using namespace std;
bool ispallindrome(struct node*,struct node**);

struct node{
    int data;
    struct node* next;
};
void ispall(struct node *head){
    bool c=ispallindrome(head,&head);
    cout<<"\n"<<c;
}
bool ispallindrome(struct node *right,struct node **left){                          // is pallindrome
    if(right==NULL)
        return true;
    bool c = ispallindrome(right->next,left);
    if(c==true)
    {
        if(right->data==(*left)->data){
            (*left)=(*left)->next;
            return true;
        }
        else
        return false;

    }
    else 
    return false;
}

int length(struct node* head){                                  //length
    int c =0;
    while(head!=NULL){
        c++;
        head= head->next;
    }
    getchar();
    return c;
}

                                                //create node
void createnode(struct node **head){
    struct node *temp=new struct node;
    cout<<"enter the data \n";
    int data;
    cin>>data;
    cin.ignore(numeric_limits<streamsize>::max(),'\n');
    if(*head==NULL){
        *head=temp;
        temp->data=data;
        temp->next=NULL;
    }
    else{
        struct node *var=new struct node;
        var= *head;
        while(var->next!=NULL){
            var=var->next;
        }
        var->next=temp;
        temp->data=data;
        temp->next=NULL;
    }
}
                                                    //view the link list

void view(struct node *head){
    struct node* var= new struct node;
    var=head;
    while(var!=NULL){
        cout<<var->data<<"\n";
         var=var->next; 
    }
    
cin.ignore(numeric_limits<streamsize>::max(),'\n');
}


                                                            //add at begining
void addatbegining(struct node **head){
struct node *temp = new struct node;
temp->next=*head;
*head=temp;
cout<<"enter the data \n";
    int data;
    cin>>data;
    temp->data=data;
}

                                                    //delete node
void deletebylocation(struct node **head){
cout<<"enter the position to delete the node\n";
int n;
cin>>n;
cin.ignore(numeric_limits<streamsize>::max(),'\n');
struct node *temp=new struct node;
if(n==1){
    temp=*head;
    *head = (*head)->next;
    free(temp);
}
else{
    temp=*head;
    int c=1;
  while(c!=n-1)
  {
      temp=temp->next;
      c++;
  }
   struct node *var=new struct node;
   var =temp;
   temp=temp->next;
   var->next=temp->next;
   free(temp);
}
}
                                                                                //delete data using recurrsion..
bool deletebyvalue(struct node *head,struct node **constant,int datas){
        if((*constant)->data==datas){
            *constant=(*constant)->next;
            return true;
        }
        else if( (head)->data==datas){
            struct node *prev = new node;
            while(prev->next!=head){
                prev=prev->next;
            }
            prev->next=head->next;
            free(head);
            return true;
         }
         else 
          return (deletebyvalue(head->next,constant,datas));

}



                                                                //main fuction
int main(){
  struct node* head;
    head=NULL;
    int a;
    while(1){
   
    
    cout<<"   1, to create node\n   2.to add at start\n   3. to view \n   4.to delete\n   5. to delete data by reccursion\n   0. exit\n";
    cout<<"6. to find the length of the link list\n 7. to check if pallindrome \n";
    char y=getchar();
    
    switch(y){
        case '1':
        createnode(&head);
        break;
        case '2':
        addatbegining(&head);
        break;
        case '3':
        view(head);
        break;
        case '4' :
        deletebylocation(&head);
        break;
        case '5' :
        cout<<"enter the data for deletion";
        int data;
        cin>>data;
        getchar();
        deletebyvalue(head,&head,data);
        break;
        case '6':
        a=length(head);
        cout<<a;
        break;
        case '7':
        ispall(head);
        getchar();
        break;
        case '0':
        exit(0);
        default:
        cout<<"choose th right option\n";
    }
    }
    return 0;
}